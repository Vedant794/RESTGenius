import modelLogo1 from '../assets/modelLogo3.png';
import modelLogo2 from '../assets/modelLogo4.png';
import useTheme from './context/ModeContext';

function Navbar() {
    const {mode,lightTheme,darkTheme} = useTheme()
      const changeMode = () => {
        if(mode){
          lightTheme()
        }
        else{
          darkTheme()
        }
      };
  return (
      <header className={`navigation-bar ${mode ? 'bg-slate-100' : 'bg-[#323939]'} h-[13vh] flex justify-between items-center fixed top-0 z-10 w-full`}>
          <div className="logo"><img src={`${mode ? modelLogo2 : modelLogo1}`} alt="Model Logo" className='h-[60px] w-auto bg-cover' /></div>
          <div className='flex justify-evenly w-[30%]'>
            <p className={`text-xl font-sans font-semibold ${mode ? 'text-black' : 'text-white'}`}><a href="#">Blog</a></p>
            <p className={`text-xl font-sans font-semibold ${mode ? 'text-black' : 'text-white'}`}><a href="#">Github</a></p>
            <p className={`text-xl font-sans font-semibold ${mode ? 'text-black' : 'text-white'}`}><a href="#">About Us</a></p>
            <button onClick={changeMode} className={`${mode ? 'bg-slate-100' : 'bg-[#323939]'} rounded-full text-3xl`}>{mode ? "🌞" : "🌙"}</button>
          </div>
        </header>
  )
}

export default Navbar