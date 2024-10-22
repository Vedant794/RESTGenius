import React, { useEffect, useState } from 'react'
import axios from 'axios'
import useProjectName from './context/projectNameContext'

function PreviewCode() {
  const [preview,setPreview]=useState()
  const {projectName} = useProjectName()

  const handlePreview=async()=>{
    try {
      const response = await axios.get(`http://localhost:3000/backend/getProjectData/${projectName}`)
      // const springResponse=await axios.post('http://localhost:8000/generateEntity',response.data)
      setPreview(response.data)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(()=>{
    handlePreview()
  },[])

  return (
    <pre>{JSON.stringify({preview},null,2)}</pre>
  )
}

export default PreviewCode
