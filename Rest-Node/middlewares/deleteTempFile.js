import path from 'path'
import *as fs from 'fs'

export const deleteTempFiles=async(dir)=> {
  try {
    const entries = await fs.promises.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        await deleteTempFiles(fullPath);
      } else {
        await fs.promises.unlink(fullPath); // Delete the file
      }
    }
    await fs.promises.rmdir(dir);
  } catch (error) {
    console.error(`Error while deleting files: ${error.message}`);
  }
}