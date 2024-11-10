import React, { useState } from "react";
import EditorComponent from "./AceEditor";
import useTheme from "./context/ModeContext";
import axios from "axios";

type File = {
  filename: string;
  content: string;
};

type OutputDTO = {
  entityFiles: File[];
  objectFile: File[];
  repoFiles: File[];
  serviceFiles: File[];
  controllerFiles: File[];
};

interface FileObject {
  filename: string;
  content: string;
}

interface Folder {
  name: string;
  files: FileObject[];
}

const transformDataToTree = (data: any) => {
  return Object.keys(data).map((key) => {
    const seenFilenames = new Set<string>();

    const uniqueFiles = data[key].filter((file: any) => {
      const normalizedFilename = file.filename.toLowerCase();
      if (seenFilenames.has(normalizedFilename)) {
        return false;
      }
      seenFilenames.add(normalizedFilename);
      return true;
    });

    return {
      name: key,
      files: uniqueFiles.map((file: any) => ({
        filename: file.filename,
        content: file.content,
      })),
    };
  });
};

const FileTree: React.FC<{
  tree: Folder[];
  onSelectFile: (content: string, filename: string) => void;
  selectedFile: string | null;
}> = ({ tree, onSelectFile, selectedFile }) => {
  return (
    <ul className="mt-6">
      {tree.map((folder, index) => (
        <FileNode
          key={index}
          name={folder.name}
          files={folder.files}
          onSelectFile={onSelectFile}
          selectedFile={selectedFile}
        />
      ))}
    </ul>
  );
};

const FileNode: React.FC<{
  name: string;
  files: FileObject[];
  onSelectFile: (content: string, filename: string) => void;
  selectedFile: string | null;
}> = ({ name, files, onSelectFile, selectedFile }) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleFolder = () => setIsOpen(!isOpen);
  const { mode } = useTheme();
  const seenFilenames = new Set<string>();

  return (
    <li className="mb-5">
      <span
        onClick={toggleFolder}
        className="cursor-pointer text-lg font-custom-font font-medium"
      >
        {isOpen ? "📂" : "📁"} {name}
      </span>
      {isOpen && (
        <ul style={{ paddingLeft: "20px" }}>
          {files.map((file, index) => {
            const normalizedFilename = file.filename.toLowerCase();
            if (seenFilenames.has(normalizedFilename)) {
              return null;
            }
            seenFilenames.add(normalizedFilename);

            return (
              <li
                key={index}
                onClick={() => onSelectFile(file.content, file.filename)}
                style={{
                  cursor: "pointer",
                  fontWeight:
                    selectedFile === file.filename ? "medium" : "normal",
                  backgroundColor:
                    selectedFile === file.filename
                      ? `${mode ? "#d1e7dd" : "#565656"}`
                      : "transparent",
                }}
                className={`font-custom-font mt-2`}
              >
                📄 {file.filename}.java
              </li>
            );
          })}
        </ul>
      )}
    </li>
  );
};

const PreviewCodeAside: React.FC<{ preview: OutputDTO | undefined }> = ({
  preview,
}) => {
  const tree = transformDataToTree(preview);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<string | null>(null);
  const { mode } = useTheme();
  const handleCopy = () => {
    if (fileContent) {
      navigator.clipboard
        .writeText(fileContent)
        .then(() => {
          alert("Content copied to clipboard!");
        })
        .catch((err) => {
          console.error("Failed to copy: ", err);
        });
    } else {
      alert("No content to copy!");
    }
  };

  // console.log(tree);
  const handleDownload = async () => {
    try {
      await axios.post(
        "http://localhost:3000/nodeorm/customCode/sendtobackend",
        tree
      );

      const response = await axios({
        url: "http://localhost:3000/nodeorm/customCode/getZipJavaCode",
        method: "GET",
        responseType: "blob", // important to handle the file as a blob
      });

      // Create a URL for the blob and simulate a download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "code.zip"); // specify the file name
      document.body.appendChild(link);
      link.click();
      link.remove();

      // Show the alert after the file download
      alert("Files Downloaded Successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to download files");
    }
  };

  const handleSelectFile = (content: string, filename: string) => {
    setFileContent(content);
    setSelectedFile(filename);
  };

  return (
    <div className="mt-[13vh] w-auto">
      <aside
        className={`side-navBar h-[90vh] overflow-y-auto w-[16vw] fixed flex flex-col items-center justify-between  ${mode ? "bg-slate-100" : "bg-[#323939] text-white"}`}
      >
        <FileTree
          tree={tree}
          onSelectFile={handleSelectFile}
          selectedFile={selectedFile}
        />
      </aside>

      <main className="ml-[30vh] mt-[10vh] h-auto w-[80vw] pt-6">
        {fileContent && (
          <div className="ml-[9vw] ">
            <EditorComponent
              code={fileContent}
              setCode={setFileContent}
              lang="java"
            />
          </div>
        )}
        <div className="but ml-[9vw] flex justify-evenly items-center mt-2">
          <button
            className="w-auto h-auto px-7 py-3 bg-green-500 rounded-xl text-xl font-custom-font text-white shadow-lg"
            onClick={handleDownload}
          >
            Download
          </button>
          <button
            className="w-auto h-auto px-5 py-3 bg-blue-600 rounded-xl text-lg font-custom-font text-slate-100 shadow-lg"
            onClick={handleCopy}
          >
            Copy
          </button>
          {/* <pre>{JSON.stringify({tree},null,2)}</pre> */}
        </div>
      </main>
    </div>
  );
};

export default PreviewCodeAside;
