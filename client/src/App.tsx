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
import PreviewCode from './components/PreviewCode';
import { ProjectNameContextProvider } from './components/context/projectNameContext';
import { SchemaIndexProvider } from './components/context/SchemaIndex';


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

const [schemas, setSchemas] = useState<any[]>([]);
const [routes, setRoutes] = useState<any[]>([]);
const [relation, setRelation] = useState<any[]>([]);
const [projectName,setProjectName]=useState("")
const [ind,setIndex] = useState(-1)


  return (
    <ThemeProvider value={{mode,darkTheme,lightTheme}}>
    <SchemaProvider value={{schemas,setSchemas}}>
    <RouteContextProvider value={{routes,setRoutes}}>
    <RelationContextProvider value={{relation,setRelation}}>
    <ProjectNameContextProvider value={{projectName,setProjectName}}>
      <SchemaIndexProvider value={{ind,setIndex}}>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<HomePage/>}></Route>
        <Route path='/getstarted' element={<GetStarted/>}></Route>
        <Route path='/getstarted/projectDetails' element={<ProjectDetails/>}></Route>
        <Route path='/getstarted/customSchema' element={<CustomSchema/>}></Route>
        <Route path='/getstarted/customSchema/routes' element={<CreateRoute/>}></Route>
        <Route path='/getstarted/customSchema/routes/relation' element={<CreateRelations/>}></Route>
        <Route path='/getstarted/previewCustomization' element={<PreviewCode/>}></Route>
      </Routes>
    </BrowserRouter>
    </SchemaIndexProvider>
    </ProjectNameContextProvider>
    </RelationContextProvider>
    </RouteContextProvider>
    </SchemaProvider>
    </ThemeProvider>
  )
}

export default App
