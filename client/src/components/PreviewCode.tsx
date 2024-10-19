import React, { useEffect, useState } from 'react'
// import useSchema from './context/schemaContext'
import axios from 'axios'
import useProjectName from './context/projectNameContext'

function PreviewCode() {
  const [data,setData]=useState()
  const {projectName} = useProjectName()

  const handlePreview=async()=>{
    const response=await axios.get(`http://localhost:3000/backend/getProjectData/${projectName}`)
    setData(response.data)
  }

  useEffect(()=>{
    handlePreview()
  },[])

  return (
    <div>{data}</div>
  )
}

export default PreviewCode
