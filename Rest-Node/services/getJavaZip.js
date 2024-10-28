import * as fs from 'fs';
import archiver from 'archiver';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateJavaFiles } from './generateJavaFiles.js';
import { extractZip } from '../middlewares/manageZipRecurrsion.js';
import { deleteTempFiles } from '../middlewares/deleteTempFile.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getJavaZipFile = async (req, res) => {
    try {
        await generateJavaFiles();

        const tempDir = path.join(__dirname, 'Repository');
        const tempZipPath = path.join(tempDir, 'Repository.zip');
        const flattenedZipPath = path.join(tempDir, 'Repository_flattened.zip');

        // Extract and handle nested ZIP files
        if (fs.existsSync(tempZipPath)) {
            const extractedDir = path.join(tempDir, 'extracted');
            if (!fs.existsSync(extractedDir)) {
                fs.mkdirSync(extractedDir, { recursive: true });
            }

            // Extract the nested ZIP
            await extractZip(tempZipPath, extractedDir);

            // Recompress the extracted contents into a new ZIP file, excluding the original ZIP
            const output = fs.createWriteStream(flattenedZipPath);
            const archive = archiver('zip');

            output.on('close', () => {
                res.download(flattenedZipPath);
            });

            archive.on('error', (err) => {
                throw err;
            });

            archive.pipe(output);

            // Archive the extracted directory, but exclude any remaining ZIP files if necessary
            archive.directory(extractedDir, false, (entry) => {
                // Filter out ZIP files to avoid nesting again
                if (entry.name.endsWith('.zip')) {
                    return false;
                }
                return entry;
            });

            await archive.finalize();
        } else {
            // Proceed as usual if no nested ZIP files are found
            const output = fs.createWriteStream(tempZipPath);
            const archive = archiver('zip');

            output.on('close', () => {
                res.download(tempZipPath);
            });

            archive.on('error', (err) => {
                throw err;
            });

            archive.pipe(output);
            archive.directory(tempDir, false);
            await archive.finalize();
        }

        deleteTempFiles(tempDir)

    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};
