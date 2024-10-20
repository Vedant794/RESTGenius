import { useState } from 'react';
import ProjectDetails from './ProjectDetails';
import useTheme from './context/ModeContext';
import Navbar from './Navbar';
import Introduction from './introduction';

export default function GetStarted() {
  const [activeLink, setActiveLink] = useState("intro");
  const {mode} = useTheme()
  interface Options {
    name: string;
    text: string;
    content: JSX.Element;
    link: string;
  }
  
  const customizeOptions: Options[] = [
    { 
      name: "intro", 
      text: "Introduction", 
      content:<Introduction />, 
      link: "/getstarted"
    },
    { 
      name: "project", 
      text: "Project Details", 
      content: <ProjectDetails />, 
      link: "/getstarted/projectDetails"
    },
  ];

  const updateActiveLink = (id: string) => {
    setActiveLink(id);
  };

  return (
    <>
      <div className="h-screen flex flex-col">
        <Navbar/>
        
        {/* Main container with flex layout */}
        <div className="flex h-screen mt-[13vh]">
          <aside className={`side-navBar h-[88vh] w-[16vw] fixed ${mode ? 'bg-slate-100' : 'bg-[#323939]'} flex flex-col items-center justify-between overflow-y-auto`}>
            <ul className='mb-2'>
              {
                customizeOptions.map(element => (
                  <li key={element.name}>
                    <button onClick={() => updateActiveLink(element.name)} className={`text-md font-sans h-[6vh] w-[16vw] ${mode ? 'text-black' : 'text-white'} ${activeLink === element.name ? 'bg-blue-500' : mode ? 'bg-slate-100' : 'bg-[#323939]'} ${mode ? 'hover:bg-slate-300' : 'hover:bg-[#202725]'} transition`}><a href="#">{element.text}</a></button>
                  </li>
                ))
              }
            </ul>
          </aside>

          {/* Main content area */}
          <main className={`h-full ml-[16vw] p-10 flex-1 ${mode ? 'bg-slate-50' : 'bg-[#202725]'}`}>
            {
              customizeOptions.map(element => (
                  <section key={element.name} className={`${activeLink === element.name ? 'block' : 'hidden'} ${mode ? 'text-black' : 'text-white'}`}>
                    {element.content}
                  </section>
              ))
            }
          </main>
        </div>
      </div>
    </>
  );
}
