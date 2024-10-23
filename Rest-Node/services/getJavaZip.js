import * as fs from 'fs';
import archiver from 'archiver';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateJavaFiles } from './generateJavaFiles.js';
import { extractZip } from '../middlewares/manageZipRecurrsion.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getJavaZipFile = async (req, res) => {
    try {
        await generateJavaFiles();

        const tempDir = path.join(__dirname, 'Repository');
        const tempZipPath = path.join(tempDir, 'Repository.zip');

        // Extract and handle nested ZIP files
        if (fs.existsSync(tempZipPath)) {
            // Create a directory to extract the nested ZIP contents
            const extractedDir = path.join(tempDir, 'extracted');
            if (!fs.existsSync(extractedDir)) {
                fs.mkdirSync(extractedDir, { recursive: true });
            }

            extractZip(tempZipPath, extractedDir);

            // Re-compress the extracted contents into a new ZIP file
            const output = fs.createWriteStream(path.join(tempDir, `Repository_flattened.zip`));
            const archive = archiver('zip');

            output.on('close', () => {
                res.download(path.join(tempDir, `Repository_flattened.zip`));
            });

            archive.on('error', (err) => {
                throw err;
            });

            archive.pipe(output);
            archive.directory(extractedDir, false);
            await archive.finalize();
        } else {
            // Proceed as usual if no nested ZIP files are found
            const output = fs.createWriteStream(path.join(tempDir, `Repository.zip`));
            const archive = archiver('zip');

            output.on('close', () => {
                res.download(path.join(tempDir, `Repository.zip`));
            });

            archive.on('error', (err) => {
                throw err;
            });

            archive.pipe(output);
            archive.directory(tempDir, false);
            await archive.finalize();
        }

    } catch (error) {
        console.error(error);
    }
};
