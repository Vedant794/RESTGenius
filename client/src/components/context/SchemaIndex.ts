import React, { createContext, Dispatch, useContext } from "react";

interface schemaIndex{
    ind:number,
    setIndex:Dispatch<React.SetStateAction<number>>
}

export const SchemaIndexContext=createContext<schemaIndex | undefined>(undefined)

export const SchemaIndexProvider = SchemaIndexContext.Provider

export default function useSchemaIndex(){
    const context = useContext(SchemaIndexContext);
    if (context === undefined) {
        throw new Error('Schema Index Not Found');
    }
    return context;
}