// import React from 'react'
import HomePage from './components/HomePage'
import GetStarted from './components/GetStarted'
import { BrowserRouter,Routes,Route } from "react-router-dom";


function App() {
  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<HomePage/>}></Route>
        <Route path='/getstarted' element={<GetStarted/>}></Route>
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
