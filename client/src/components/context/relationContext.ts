import React, { Dispatch, createContext, useContext } from "react";

interface relationContextType{
    relation:any[],
    setRelation:Dispatch<React.SetStateAction<any[]>>
}

export const RelationContext=createContext<relationContextType|undefined>(undefined)

export const RelationContextProvider=RelationContext.Provider

export default function useRelation() {
    const context = useContext(RelationContext);
    if (context === undefined) {
        throw new Error('useRelation must be used within a RelationContextProvider');
    }
    return context;
}