import React, { useState } from 'react';

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
  return Object.keys(data).map(key => ({
    name: key,
    files: data[key].map((file: any) => ({
      filename: file.filename,
      content: file.content,
    })),
  }));
};

const FileTree: React.FC<{ tree: Folder[], onSelectFile: (content: string, filename: string) => void; selectedFile: string | null }> = ({ tree, onSelectFile, selectedFile }) => {
  return (
    <ul className='mt-6'>
      {tree.map((folder, index) => (
        <FileNode key={index} name={folder.name} files={folder.files} onSelectFile={onSelectFile} selectedFile={selectedFile} />
      ))}
    </ul>
  );
};

const FileNode: React.FC<{ name: string; files: FileObject[]; onSelectFile: (content: string, filename: string) => void; selectedFile: string | null }> = ({ name, files, onSelectFile, selectedFile }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleFolder = () => {
    setIsOpen(!isOpen);
  };

  return (
    <li className='mb-5'>
      <span onClick={toggleFolder} className='cursor-pointer text-lg font-mono font-medium'>
        {isOpen ? '📂' : '📁'} {name}
      </span>
      {isOpen && (
        <ul style={{ paddingLeft: '20px' }}>
          {files.map((file, index) => (
            <li
              key={index}
              onClick={() => onSelectFile(file.content, file.filename)}
              style={{
                cursor: 'pointer',
                fontWeight: selectedFile === file.filename ? 'bold' : 'normal',
                backgroundColor: selectedFile === file.filename ? '#d1e7dd' : 'transparent',
              }}
            >
              📄 {file.filename}
            </li>
          ))}
        </ul>
      )}
    </li>
  );
};

const PreviewCodeAside: React.FC<{ preview: OutputDTO | undefined }> = ({ preview }) => {
  const tree = transformDataToTree(preview);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<string | null>(null);

  const handleSelectFile = (content: string, filename: string) => {
    setFileContent(content);  // Store file content for preview
    setSelectedFile(filename); // Track the currently selected file
  };

  return (
    <div className='mt-[13vh] flex justify-between h-screen w-auto'>
      <aside className='side-navBar h-[88vh] w-[16vw] fixed flex flex-col items-center justify-between bg-slate-100'>
        <FileTree tree={tree} onSelectFile={handleSelectFile} selectedFile={selectedFile} />
      </aside>

      <main className='ml-[65vh]'>
        {/* Display only the selected file's content */}
        {fileContent && (
          <div style={{ marginTop: '10px', paddingLeft: '20px', fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
            {/* <h4>{fileName}</h4> */}
            <pre>{fileContent}</pre>
          </div>
        )}
      </main>
    </div>
  );
};

export default PreviewCodeAside;
