import React, { useEffect, useState } from "react";
import axios from "axios";
import useProjectName from "./context/projectNameContext";
import beautify from "js-beautify";
import Navbar from "./Navbar";
import PreviewCodeAside from "./PreviewCodeAside";
import usePreviewLoad from "./context/previwLoading";
import Loading from "./Loading";

function PreviewCode() {
  const [preview, setPreview] = useState<OutputDTO | undefined>(undefined);
  const { projectName } = useProjectName();

  const { load, setLoad } = usePreviewLoad();

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
      setLoad(0);
      const response = await axios.get(
        `http://localhost:3000/backend/getProjectData/${projectName}`
      );
      setLoad(25);
      const springResponse = await axios.post(
        "http://localhost:8000/generateEntity",
        response.data.projectData
      );
      setLoad(50);
      const parsedData: OutputDTO = springResponse.data;

      // Format Java code for each file in entityFiles, objectFile, repoFiles, serviceFiles, and controllerFiles
      const formatFiles = (files: File[]) => {
        return files.map((file) => ({
          ...file,
          content: formatJavaCode(`${file.content}`), // Format the content of each file
        }));
      };
      setLoad(75);

      parsedData.entityFiles = formatFiles(parsedData.entityFiles);
      parsedData.objectFile = formatFiles(parsedData.objectFile);
      parsedData.repoFiles = formatFiles(parsedData.repoFiles);
      parsedData.serviceFiles = formatFiles(parsedData.serviceFiles);
      parsedData.controllerFiles = formatFiles(parsedData.controllerFiles);

      setLoad(100);

      setPreview(parsedData); // Set the formatted parsedData to preview
    } catch (error) {
      console.error(error);
    }
  };

  function formatJavaCode(javaCode: string) {
    // Replace HTML-encoded entities with their corresponding characters
    const cleanJavaCode = javaCode
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&amp;/g, "&") // Replacing &amp; to & in case of encoded ampersands
      .replace(/&#39;/g, "'");
    // Format the cleaned Java code
    let formatted = beautify(cleanJavaCode, {
      indent_size: 2, // Configure the indentation level
      preserve_newlines: true,
    });
    formatted = formatted.replace(/\(\)\s*-\s*>/g, "()->");
    return formatted;
  }

  useEffect(() => {
    handlePreview();
  }, []);

  return (
    // <pre>{JSON.stringify({preview},null,2)}</pre>
    <>
      <Navbar />
      <div className="preview overflow-y-hidden ">
        {load < 100 ? (
          <div className="loading-indicator">
            <Loading />
          </div>
        ) : (
          preview && <PreviewCodeAside preview={preview} />
        )}
      </div>
    </>
  );
}

export default PreviewCode;
