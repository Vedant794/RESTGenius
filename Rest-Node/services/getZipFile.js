import * as fs from 'fs';
import archiver from 'archiver';
import path from 'path';
import { fileURLToPath } from 'url';
import { getSchemaForUser } from './getSchemaForUser.js';
import { generateSchemaFiles } from './generateFiles.js';
import { extractZip } from '../middlewares/manageZipRecurrsion.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getZipFile = async (req, res) => {
    try {
        const schemaId = req.params.id;
        const schemas = getSchemaForUser(schemaId);
        await generateSchemaFiles(schemas);

        const tempDir = path.join(__dirname, `${schemas.projectName}`);
        const tempZipPath = path.join(tempDir, `${schemas.projectName}.zip`);

        // Extract and handle nested ZIP files
        if (fs.existsSync(tempZipPath)) {
            // Create a directory to extract the nested ZIP contents
            const extractedDir = path.join(tempDir, 'extracted');
            if (!fs.existsSync(extractedDir)) {
                fs.mkdirSync(extractedDir, { recursive: true });
            }

            extractZip(tempZipPath, extractedDir);

            // Re-compress the extracted contents into a new ZIP file
            const output = fs.createWriteStream(path.join(tempDir, `${schemas.projectName}_flattened.zip`));
            const archive = archiver('zip');

            output.on('close', () => {
                res.download(path.join(tempDir, `${schemas.projectName}_flattened.zip`));
            });

            archive.on('error', (err) => {
                throw err;
            });

            archive.pipe(output);
            archive.directory(extractedDir, false);
            await archive.finalize();
        } else {
            // Proceed as usual if no nested ZIP files are found
            const output = fs.createWriteStream(path.join(tempDir, `${schemas.projectName}.zip`));
            const archive = archiver('zip');

            output.on('close', () => {
                res.download(path.join(tempDir, `${schemas.projectName}.zip`));
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
