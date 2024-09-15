import path from 'path'
import *as fs from 'fs'

export const deleteTempFiles=async(dir)=> {
    const entries = await fs.promises.readdir(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        await deleteTempFiles(fullPath);
        await fs.promises.rmdir(fullPath);
      } else {
        await fs.promises.unlink(fullPath);
      }
    }
}