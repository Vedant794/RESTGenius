import React, { Dispatch, createContext, useContext } from 'react'

interface previewType{
    load:number
    setLoad:Dispatch<React.SetStateAction<number>>
}

export const previewLoadContext = createContext<previewType | undefined>(undefined)

export const PreviewLoadContextProvider = previewLoadContext.Provider

export default function usePreviewLoad(){
    const context = useContext(previewLoadContext)
    if(context === undefined){
        throw new Error('Context not Provided Properly in Loading Preview')
    }

    return context;
}