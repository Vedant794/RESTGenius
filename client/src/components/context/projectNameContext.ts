import { createContext, useContext, Dispatch } from "react";

interface projectNameType{
    projectName:string,
    setProjectName:Dispatch<React.SetStateAction<string>>
}

export const projectNameContext = createContext<projectNameType|undefined>(undefined)

export const ProjectNameContextProvider = projectNameContext.Provider

export default function useProjectName(){
    const context = useContext(projectNameContext)
    if (context === undefined) {
        throw new Error('useRoute must be used within a RouteContextProvider');
    }
    return context;
}

