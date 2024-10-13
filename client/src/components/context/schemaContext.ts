import React from "react";
import { createContext, useContext,Dispatch } from "react";

interface schemaContextType{
  schemas:any[],
  setSchemas:Dispatch<React.SetStateAction<any[]>>
}

export const schemaContext=createContext<schemaContextType|undefined>(undefined)

export const SchemaProvider=schemaContext.Provider

export default function useSchema(){
    useContext(schemaContext)
}