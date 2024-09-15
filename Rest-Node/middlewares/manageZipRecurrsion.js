import AdmZip from 'adm-zip';
import *as fs from 'fs'

// Function to recursively extract zip files
export const extractZip = (zipPath, outputDir) => {
    const zip = new AdmZip(zipPath);
    zip.extractAllTo(outputDir, true);

    // Recursively extract any zip files found in the output directory
    fs.readdirSync(outputDir).forEach(file => {
        const filePath = path.join(outputDir, file);
        if (fs.statSync(filePath).isDirectory()) {
            extractZip(filePath, filePath); // Extract nested zips
        }
    });
};
