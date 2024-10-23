import React from 'react';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-java'; // Java mode
import 'ace-builds/src-noconflict/theme-monokai'; // Dark theme
import 'ace-builds/src-noconflict/theme-chrome'; // Light theme
import 'ace-builds/src-noconflict/ext-language_tools'; // For Autocompletion
import useTheme from './context/ModeContext';
import ace from 'ace-builds';

ace.config.set('basePath', '/node_modules/ace-builds/src-noconflict/')

const EditorComponent: React.FC<{ code: string, setCode: (code: string) => void, lang: string }> = ({ code, setCode, lang }) => {
    const {mode} = useTheme()
    const theme = mode ? 'chrome' : 'monokai';

  return (
    <div className='pt-[2vh]'>
    <AceEditor
      mode={lang === 'java' ? 'java' : 'text'} 
      theme={theme}
      value={code}
      onChange={(newValue) => setCode(newValue)}
      fontSize={14}
      showPrintMargin={false}
      showGutter={true}
      highlightActiveLine={true}
      width="100%"
      height="70vh"
      setOptions={{
        enableBasicAutocompletion: true,
        enableLiveAutocompletion: true,
        enableSnippets: true,
        showLineNumbers: true,
        tabSize: 2,
        useWorker: false,
      }}
    />
    </div>
  );
};

export default EditorComponent;
