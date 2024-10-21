import React, { useEffect, useState } from 'react'
import axios from 'axios'
import useProjectName from './context/projectNameContext'

function PreviewCode() {
  const [preview,setPreview]=useState()
  const {projectName} = useProjectName()

  const handlePreview=async()=>{
    try {
      const response = await axios.get(`http://localhost:3000/backend/getProjectData/next`)
      setPreview(response.data)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(()=>{
    handlePreview()
  },[])

  return (
    <pre>{JSON.stringify(preview)}</pre>
  )
}

export default PreviewCode
