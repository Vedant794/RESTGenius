import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import ejs from 'ejs'
import tmp from 'tmp'

const __filename=fileURLToPath(import.meta.url)
const __dirname=path.join(__filename)

const generateSchemaFile=async(schemaCode,fileName)=>{
    try {
        const templetePath=path.join(__dirname,'./model.js')
        const templete=fs.readFileSync(templetePath,'utf-8')
        const schemaCode=ejs.render(templete,schemaCode)
        const tempFile=tmp.dirSync({name:fileName,postfix:'.js'})
        
        
    } catch (error) {
        
    }
}