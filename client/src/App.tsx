// import React from 'react'
import HomePage from './components/HomePage'
import GetStarted from './components/GetStarted'
import { BrowserRouter,Routes,Route } from "react-router-dom";
import ProjectDetails from './components/ProjectDetails';
import CustomSchema from './components/CustomSchema';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<HomePage/>}></Route>
        <Route path='/getstarted' element={<GetStarted/>}></Route>
        <Route path='/getstarted/projectDetails' element={<ProjectDetails/>}></Route>
        <Route path='/getstarted/customSchema' element={<CustomSchema/>}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
