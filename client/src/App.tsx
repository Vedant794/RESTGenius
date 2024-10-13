// import React from 'react'
import HomePage from './components/HomePage'
import GetStarted from './components/GetStarted'
import { BrowserRouter,Routes,Route } from "react-router-dom";
import ProjectDetails from './components/ProjectDetails';
import CustomSchema from './components/CustomSchema';
import CreateRoute from './components/CreateRoute';
import CreateRelations from './components/CreateRelations';
import { ThemeProvider } from './components/context/ModeContext';
import { useEffect, useState } from 'react';
import { SchemaProvider } from './components/context/schemaContext';
import { RouteContextProvider } from './components/context/routeContext';
import { RelationContextProvider } from './components/context/relationContext';


function App() {
const [mode,setMode]=useState(true)
const darkTheme=()=>{
  setMode(!mode)
}

const lightTheme=()=>{
  setMode(!mode)
}

useEffect(()=>{
  if(mode){
    document.body.style.backgroundColor="white"
    document.body.style.color="black"
  }
  else{
    document.body.style.backgroundColor="#202725"
    document.body.style.color="white"
  }
},[mode])

  return (
    <ThemeProvider value={{mode,darkTheme,lightTheme}}>
    <SchemaProvider value={undefined}>
    <RouteContextProvider value={undefined}>
    <RelationContextProvider value={undefined}>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<HomePage/>}></Route>
        <Route path='/getstarted' element={<GetStarted/>}></Route>
        <Route path='/getstarted/projectDetails' element={<ProjectDetails/>}></Route>
        <Route path='/getstarted/customSchema' element={<CustomSchema/>}></Route>
        <Route path='/getstarted/customSchema/routes' element={<CreateRoute/>}></Route>
        <Route path='/getstarted/customSchema/routes/relation' element={<CreateRelations/>}></Route>
      </Routes>
    </BrowserRouter>
    </RelationContextProvider>
    </RouteContextProvider>
    </SchemaProvider>
    </ThemeProvider>
  )
}

export default App
