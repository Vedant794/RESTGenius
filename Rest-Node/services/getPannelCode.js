import *as fs from 'fs'
import ejs from 'ejs'
import path from 'path'
import { fileURLToPath } from 'url'
import {getSchemaForUser}  from './getSchemaForUser.js'
import {generateSchemaFiles} from './generateFiles.js'
import {deleteTempFiles} from '../middlewares/deleteTempFile.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getFilesFromDir=(dirName,fileList=[])=>{
    const files=fs.readdirSync(dirName);

    files.forEach(file => {
        const fullPath=path.join(dirName,file);
        const stat=fs.statSync(fullPath)
        if(stat.isDirectory()){
            getFilesFromDir(fullPath,fileList)
        }
        else{
            const fileContent=fs.readFileSync(fullPath,'utf-8')
            fileList.push({name:file,content:fileContent,path:fullPath})
        }
    });
    return fileList;
}

export const getPannelCode=async(req,res)=>{
    try {
        const schemaId=req.params.id;
        const schemaCode=getSchemaForUser(schemaId);
        await generateSchemaFiles(schemaCode);
    
        const tempDir=path.resolve(__dirname,`${schemaCode.projectName}`);
    
        const files=getFilesFromDir(tempDir);

        res.render('pannel', { files });  //This part is now causing error so deal it later
        // console.log(files)
        await deleteTempFiles(tempDir);
    } catch (error) {
        console.error(error)
    }

}

