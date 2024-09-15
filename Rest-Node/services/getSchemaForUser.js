import {data} from '../frontendOutput.js'

export const getSchemaForUser=(schemaId)=>{
    const schemaData=data.find(element=>element.projectName===schemaId)

    if(schemaData){
        return schemaData;
    }else{
        throw new Error(`${schemaId} is not Found in Internal Storage`)
    }
}