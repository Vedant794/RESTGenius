import * as fs from 'fs';
import ejs from 'ejs';
import path from 'path';
import { fileURLToPath } from 'url';
import { data } from '../frontendOutput.js'; // Assuming frontendOutput.js exports the array

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
        // Generating entity files
        if (Array.isArray(fileGroup.entityFiles)) {
            for (const entity of fileGroup.entityFiles) {
                const entityFileName = entity.filename;
                const entityFilePath = path.join(__dirname, 'javaFileTemplete', 'entityFiles.ejs');
                const entityContent = await ejs.renderFile(entityFilePath, entity);
                fs.writeFileSync(path.join(entityFilesDir, `${entityFileName}.java`), entityContent);
            }
        }

        // Generating object files
        if (Array.isArray(fileGroup.objectFiles)) {
            for (const object of fileGroup.objectFiles) {
                const objectFileName = object.filename;
                const objectFilePath = path.join(__dirname, 'javaFileTemplete', 'objectFiles.ejs');
                const objectContent = await ejs.renderFile(objectFilePath, object);
                fs.writeFileSync(path.join(objectFilesDir, `${objectFileName}.java`), objectContent);
            }
        }

        // Generating repository files
        if (Array.isArray(fileGroup.repoFiles)) {
            for (const repo of fileGroup.repoFiles) {
                const repoFileName = repo.filename;
                const repoFilePath = path.join(__dirname, 'javaFileTemplete', 'repoFiles.ejs');
                const repoContent = await ejs.renderFile(repoFilePath, repo);
                fs.writeFileSync(path.join(repoFilesDir, `${repoFileName}.java`), repoContent);
            }
        }

        // Generating service files
        if (Array.isArray(fileGroup.serviceFiles)) {
            for (const service of fileGroup.serviceFiles) {
                const serviceFileName = service.filename;
                const serviceFilePath = path.join(__dirname, 'javaFileTemplete', 'serviceFiles.ejs');
                const serviceContent = await ejs.renderFile(serviceFilePath, service);
                fs.writeFileSync(path.join(serviceFilesDir, `${serviceFileName}.java`), serviceContent);
            }
        }

        // Generating controller files
        if (Array.isArray(fileGroup.controllerFiles)) {
            for (const controller of fileGroup.controllerFiles) {
                const controllerName = controller.filename;
                const controllerFilePath = path.join(__dirname, 'javaFileTemplete', 'controllerFiles.ejs');
                const controllerContent = await ejs.renderFile(controllerFilePath, controller);
                fs.writeFileSync(path.join(controllerFilesDir, `${controllerName}.java`), controllerContent);
            }
        }
    }

    return tempDir;
}
