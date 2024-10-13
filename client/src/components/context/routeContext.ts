import React, { createContext, Dispatch, useContext } from "react";

interface routeContextType{
    routes:any[],
    setRoutes:Dispatch<React.SetStateAction<any[]>>
}

export const RouteContext=createContext<routeContextType|undefined>(undefined)

export const RouteContextProvider=RouteContext.Provider

export default function useRoutes(){
    useContext(RouteContext)
}