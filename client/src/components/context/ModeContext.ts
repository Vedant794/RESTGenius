import React,{useContext} from 'react';

export const ModeContext=React.createContext({
    mode:true,
    darkTheme:()=>{},
    lightTheme:()=>{}
});

export const ThemeProvider = ModeContext.Provider 

export default function useTheme(){
    return useContext(ModeContext);
}