import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import useTheme from './context/ModeContext';

export default function GetStarted() {
  const { mode } = useTheme();
  const location = useLocation();
  const [activeLink, setActiveLink] = useState("");

  interface Options {
    name: string;
    text: string;
    link: string;
  }

  const customizeOptions: Options[] = [
    { 
      name: "intro", 
      text: "Introduction",
      link: "/getstarted"
    },
    { 
      name: "project", 
      text: "Project Details",  
      link: "/getstarted/projectDetails"
    },
    {
      name: "schema",
      text: "Customize Schema",
      link: "/getstarted/customSchema"
    },
    {
      name: "routes",
      text: "Create Routes",
      link: "/getstarted/routes",
    },
    {
      name: "relation",
      text: "Create Relations",
      link: "/getstarted/relation"
    },
    {
      name:"Ace",
      text:"Ace Editor",
      link:'/getstarted/AceEditor'
    }
  ];

  // Update activeLink based on the current pathname
  useEffect(() => {
    const currentPath = location.pathname;
    const activeOption = customizeOptions.find(option => option.link === currentPath);
    if (activeOption) {
      setActiveLink(activeOption.name);
    }
  }, [location.pathname]); // Run this effect whenever the URL changes

  return (
    <>
      {/* Main container with flex layout */}
      <div className="flex h-screen mt-[13vh] w-auto">
        <aside className={`side-navBar h-[88vh] w-[16vw] fixed ${mode ? 'bg-slate-100' : 'bg-[#323939]'} flex flex-col items-center justify-between`}>
          <ul className='mb-2'>
            {
              customizeOptions.map(element => (
                <li key={element.name}>
                  <Link to={element.link}>
                    <button 
                      onClick={() => setActiveLink(element.name)} 
                      className={`text-md font-sans h-[6vh] w-[16vw] ${mode ? 'text-black' : 'text-white'} 
                        ${activeLink === element.name ? 'bg-blue-500' : mode ? 'bg-slate-100' : 'bg-[#323939]'} 
                        ${mode ? 'hover:bg-slate-300' : 'hover:bg-[#202725]'} transition`}
                    >
                      {element.text}
                    </button>
                  </Link>
                </li>
              ))
            }
          </ul>
          <Link to='/getstarted/previewCustomization'>
            <button className='h-auto w-auto px-5 py-2 bg-green-600 mb-8 text-lg font-serif text-white font-semibold rounded-xl'>Preview</button>
          </Link>
        </aside>
      </div>
    </>
  );
}
