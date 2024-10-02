import {useState} from 'react'
import modelLogo1 from '../assets/modelLogo3.png'
import modelLogo2 from '../assets/modelLogo4.png'
import ProjectDetails from './ProjectDetails'
import SelectController from './SelectController'

export default function GetStarted() {
  const [activeLink,setActiveLink]=useState("intro")
  const [mode,setMode]=useState(true)

  interface options{
    name:string,
    text:string,
    content:JSX.Element
  }
  const customizeOptions:options[]=[
    {name:"intro",text:"Introduction",content:<></>},
    {name:"project",text:"Project Details",content:<ProjectDetails mode={mode}/>},
    {name:"model",text:"Customize Schema",content:<></>},
    {name:"controller",text:"Select Controllers",content:<SelectController/>},
    {name:"routes",text:"Customize Routes",content:<></>},
    {name:"middlewares",text:"Choose Middlewares",content:<></>}
  ]

  const updateActiveLink=(id:string)=>{
    setActiveLink(id);
  }

  const changeMode=()=>{
    setMode(!mode)
  }
  return (
    <>
    <div className="h-screen flex flex-col">
      <header className={`navigation-bar ${mode?'bg-slate-100':'bg-[#323939]'} h-[13vh] flex justify-between items-center fixed top-0 z-10 w-[100%]`}>
        <div className="logo"><img src={`${mode?modelLogo2:modelLogo1}`} alt="Model Logo" className='h-[60px] w-auto bg-cover'/></div>
        <div className='flex justify-evenly w-[30%]'>
        <p className={`text-xl font-sans font-semibold ${mode?'text-black':'text-white'}`}><a href="#">Blog</a></p>
        <p className={`text-xl font-sans font-semibold ${mode?'text-black':'text-white'}`}><a href="#">Github</a></p>
        <p className={`text-xl font-sans font-semibold ${mode?'text-black':'text-white'}`}><a href="#">About Us</a></p>
        <button onClick={changeMode} className={`${mode?'bg-slate-100':'bg-[#323939]'} rounded-full text-3xl`}>{mode ? "🌞" : "🌙"}</button>

        </div>
      </header>
      <div className="flex h-screen mt-[13vh]">
        <aside className={`side-navBar h-[88vh] w-[16vw] fixed ${mode?'bg-slate-100':'bg-[#323939]'} flex flex-col items-center justify-between overflow-y-auto`}>
          <ul className='mb-2'>
            {
              customizeOptions.map(element => (
                <li key={element.name}>
                  <button onClick={()=>updateActiveLink(element.name)} className={`text-md font-sans h-[6vh] w-[16vw] ${mode ? 'text-black' : 'text-white'} ${activeLink === element.name ? 'bg-blue-500' : mode ? 'bg-slate-100' : 'bg-[#323939]'} ${mode?'hover:bg-slate-300':'hover:bg-[#202725]'} transition`}><a href="#">{element.text}</a></button>
                </li>
              ))
            }
          </ul>

          <button className={`h-[3rem] w-[13rem] shadow-lg ${mode?'shadow-gray-600':'shadow-black'} rounded-xl mb-4 bg-green-500 text-white font-bold text-xl transition duration-300 transform hover:scale-110`}>Generate</button>
        </aside>
        <main className={`ml-[16vw] p-10 flex-1 ${mode?'bg-slate-50':'bg-[#202725]'} flex justify-center items-center`}>
            {
              customizeOptions.map(element=>(
                <section key={element.name} className={`${activeLink===element.name? 'block' : "hidden"} ${mode?'text-black':'text-white'}`}>
                  {element.content}
                </section>
              ))
            }
        </main>
        
      </div>

    </div>
    </>
  )
}
