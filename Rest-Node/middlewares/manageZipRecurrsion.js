import AdmZip from 'adm-zip';
import * as fs from 'fs';
import path from 'path';

// Function to recursively extract zip files
export const extractZip = (zipPath, outputDir) => {
    const zip = new AdmZip(zipPath);
    zip.extractAllTo(outputDir, true);

    // Recursively extract any zip files found in the output directory
    fs.readdirSync(outputDir).forEach(file => {
        const filePath = path.join(outputDir, file);
        // Check if it's a directory
        if (fs.statSync(filePath).isDirectory()) {
            // Call extractZip recursively on nested zip files only
            fs.readdirSync(filePath).forEach(nestedFile => {
                const nestedFilePath = path.join(filePath, nestedFile);
                if (path.extname(nestedFile) === '.zip') {
                    extractZip(nestedFilePath, filePath); // Extract nested zips
                }
            });
        }
    });
};
