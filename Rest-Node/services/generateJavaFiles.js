import * as fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { data } from '../frontendOutput.js'; // Assuming this is your data structure

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function generateJavaFiles() {
    const tempDir = path.join(__dirname, 'Repository');
    const entityFilesDir = path.join(tempDir, 'entityFiles');
    const controllerFilesDir = path.join(tempDir, 'controllerFiles');
    const serviceFilesDir = path.join(tempDir, 'serviceFiles');
    const objectFilesDir = path.join(tempDir, 'objectFiles');
    const repoFilesDir = path.join(tempDir, 'repoFiles');

    // Create directories if they do not exist
    [entityFilesDir, controllerFilesDir, serviceFilesDir, objectFilesDir, repoFilesDir].forEach(dir => {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
    });

    // Loop through the array in data
    for (const fileGroup of data) {
        // Handle entity files
        if (fileGroup.name === 'entityFiles' && Array.isArray(fileGroup.files)) {
            for (const entity of fileGroup.files) {
                const entityFileName = entity.filename;
                const entityFilePath = path.join(entityFilesDir, `${entityFileName}.java`);
                fs.writeFileSync(entityFilePath, entity.content); // Write the content directly
            }
        }

        // Handle object files
        if (fileGroup.name === 'objectFile' && Array.isArray(fileGroup.files)) {
            for (const object of fileGroup.files) {
                const objectFileName = object.filename;
                const objectFilePath = path.join(objectFilesDir, `${objectFileName}.java`);
                fs.writeFileSync(objectFilePath, object.content); // Write the content directly
            }
        }

        // Handle repository files
        if (fileGroup.name === 'repoFiles' && Array.isArray(fileGroup.files)) {
            for (const repo of fileGroup.files) {
                const repoFileName = repo.filename;
                const repoFilePath = path.join(repoFilesDir, `${repoFileName}.java`);
                fs.writeFileSync(repoFilePath, repo.content); // Write the content directly
            }
        }

        // Handle service files
        if (fileGroup.name === 'serviceFiles' && Array.isArray(fileGroup.files)) {
            for (const service of fileGroup.files) {
                const serviceFileName = service.filename;
                const serviceFilePath = path.join(serviceFilesDir, `${serviceFileName}.java`);
                fs.writeFileSync(serviceFilePath, service.content); // Write the content directly
            }
        }

        // Handle controller files
        if (fileGroup.name === 'controllerFiles' && Array.isArray(fileGroup.files)) {
            for (const controller of fileGroup.files) {
                const controllerFileName = controller.filename;
                const controllerFilePath = path.join(controllerFilesDir, `${controllerFileName}.java`);
                fs.writeFileSync(controllerFilePath, controller.content); // Write the content directly
            }
        }
    }

    return tempDir;
}
