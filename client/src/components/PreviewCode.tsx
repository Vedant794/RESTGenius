import React, { useEffect, useState } from 'react'
import axios from 'axios'
import useProjectName from './context/projectNameContext'
import beautify from 'js-beautify'
import Navbar from './Navbar'
import PreviewCodeAside from './PreviewCodeAside'

function PreviewCode() {
  
  const [preview,setPreview] = useState<OutputDTO | undefined>(undefined)
  const {projectName} = useProjectName()

type File = {
    filename: string;
    content: string;
};

// Define the OutputDTO type
type OutputDTO = {
    entityFiles: File[];
    objectFile: File[];
    repoFiles: File[];
    serviceFiles: File[];
    controllerFiles: File[];
};



const handlePreview = async () => {
  try {
    const response = await axios.get(`http://localhost:3000/backend/getProjectData/${projectName}`);
    const springResponse = await axios.post('http://localhost:8000/generateEntity', response.data.projectData);
    const parsedData: OutputDTO = springResponse.data;

    // Format Java code for each file in entityFiles, objectFile, repoFiles, serviceFiles, and controllerFiles
    const formatFiles = (files: File[]) => {
      return files.map(file => ({
        ...file,
        content: formatJavaCode(`${file.content}`), // Format the content of each file
      }));
    };

    parsedData.entityFiles = formatFiles(parsedData.entityFiles);
    parsedData.objectFile = formatFiles(parsedData.objectFile);
    parsedData.repoFiles = formatFiles(parsedData.repoFiles);
    parsedData.serviceFiles = formatFiles(parsedData.serviceFiles);
    parsedData.controllerFiles = formatFiles(parsedData.controllerFiles);

    setPreview(parsedData); // Set the formatted parsedData to preview
  } catch (error) {
    console.error(error);
  }
};


  function formatJavaCode(javaCode:string) {
    // Replace HTML-encoded entities with their corresponding characters
    const cleanJavaCode = javaCode
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&amp;/g, "&"); // Replacing &amp; to & in case of encoded ampersands
  
    // Format the cleaned Java code
    const formatted = beautify(cleanJavaCode, {
      indent_size: 2, // Configure the indentation level
      preserve_newlines: true,
    });
  
    return formatted;
  }

  useEffect(()=>{
    handlePreview()
  },[])

  return (
    // <pre>{JSON.stringify({preview},null,2)}</pre>
    <>
      <Navbar/>
      {preview && <PreviewCodeAside preview={preview}/>}
      
      
    </>
  )
}

export default PreviewCode