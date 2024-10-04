import { useState, useEffect, CSSProperties } from 'react';
import githubLogo from '../assets/github-mark.png';
import homeBack from '../assets/background-home.png';
import setting from '../assets/settings.gif';
import document from '../assets/document.gif';
import cloudNet from '../assets/cloud-network.gif';
import search from '../assets/search.gif';
import manage from '../assets/manage.png';
import automate from '../assets/automate.png';
import generate from '../assets/generate.png';
import openSource from '../assets/openSource.webp';
import modelLogo2 from '../assets/modelLogo2.png';
import Footer from './Footer';
import { useNavigate } from 'react-router-dom';
import useLoader from './customHooks/useLoader'; // Custom hook for handling loader state
import DotLoader from 'react-spinners/DotLoader';

const override: CSSProperties = {
  display: 'block',
  margin: '0 auto',
  borderColor: 'red',
};

export default function HomePage() {
  const [isVisible, setIsVisible] = useState(false);
  const { loading, color, toggleLoading } = useLoader('#000000', false); // Ensure loader is initially false
  const navigate = useNavigate();

  const handleLoading = () => {
    toggleLoading(); // Start loader
    setTimeout(() => {
      toggleLoading(); // Stop loader after 2 seconds
      navigate('/getstarted'); // Navigate to /getstarted page
    }, 2000); // 2-second delay for the loader simulation
  };

  interface cardAttribute {
    icon: string;
    description: string;
  }

  interface mainContentInfo {
    image: string;
    title: string;
    description: string;
  }

  const cardInfoHolder: cardAttribute[] = [
    { icon: setting, description: 'Real-time data insights and tracking' },
    { icon: document, description: 'Proper & Advanced API Documentation' },
    { icon: cloudNet, description: 'Open Source and Compatible' },
    { icon: search, description: 'Advanced Searching and Routing Technique' },
  ];

  const mainContentHolder: mainContentInfo[] = [
    {
      image: manage,
      title: 'Manage',
      description:
        'Defining endpoints, managing data flow, and ensuring efficient interaction between the API and databases while maintaining security and performance',
    },
    {
      image: automate,
      title: 'Automate',
      description:
        'Streamlines repetitive tasks like API generation, testing, and deployment, improving efficiency and reducing manual effort. It enhances scalability and consistency across API workflows.',
    },
    {
      image: generate,
      title: 'Generate',
      description: 'The automated creation of API endpoints, models, and documentation based on predefined schemas',
    },
    {
      image: openSource,
      title: 'Open Source',
      description:
        'Collaborative development, making the codebase freely available for modification and contribution. It fosters community involvement, innovation, and transparency, ensuring the project evolves with shared knowledge',
    },
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true); // Handle animation after 1.5 seconds
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <div
        className={`upSideHomePage relative h-[55rem] w-full transform transition-all duration-1000 ease-in-out ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="relative bg-cover bg-center h-[51rem] w-full" style={{ backgroundImage: `url(${homeBack})` }}>
          {/* Header */}
          <header className="header-api w-full h-[15%] flex justify-evenly items-center">
            <div className="logo-login flex justify-between w-[85%] items-center">
              <span title="Smart API generation for modern day Programmers">
                <img src={modelLogo2} alt="Logo" className="h-[60px] w-auto cursor-pointer" />
              </span>
              <button className="login w-[15rem] h-[3.76rem] bg-white rounded-full text-lg font-semibold flex justify-evenly items-center transition duration-300 transform hover:scale-110">
                <img src={githubLogo} alt="Github Logo" className="h-[25px] w-[25px]" />
                Login With Github
              </button>
            </div>
          </header>

          {/* Main Content */}
          <section className="h-[50%] w-full flex flex-col justify-center items-start px-56">
            <span className="text-6xl font-bold text-white font-sans py-4">Simple, Smart Automation</span>
            <span className="text-5xl font-bold text-white font-sans py-4">API Generation Tool</span>
            <div className='flex'>
              {/* Get Started Button with loading logic */}
              <div className="navigate">
                {loading && (
                  <div className="fixed inset-0 bg-white bg-opacity-75 flex justify-center items-center z-50">
                    <DotLoader
                      color={color}
                      loading={loading}
                      cssOverride={override}
                      size={50}
                      aria-label="Loading Spinner"
                      data-testid="loader"
                    />
                  </div>
                )}
                <button
                  onClick={handleLoading}
                  className="border-white border-2 w-[13rem] h-[3rem] text-white font-semibold font-sans rounded-full hover:bg-white hover:text-black my-4 mr-3"
                >
                  Get Started
                </button>
              </div>
              <a href="https://github.com/Vedant794/RESTGenius" target="_blank">
                <button className="border-white border-2 w-[15rem] h-[3rem] text-white font-semibold font-sans rounded-full hover:bg-white hover:text-black my-4 ml-3">
                  Contribute Open Source
                </button>
              </a>
            </div>
          </section>

          {/* Cards */}
          <div className="card absolute flex justify-center items-center h-[50%] w-full">
            {/* Card Info */}
            {cardInfoHolder.map((element: cardAttribute, index: number) => (
              <div
                className="cardInfo bg-white h-[80%] w-[16rem] flex flex-col items-center justify-evenly mx-3 rounded-xl shadow-2xl transition duration-300 transform hover:scale-110"
                key={index}
              >
                <img src={element.icon} alt={element.description} className="h-[100px] w-[100px]" />
                <p className="description text-xl font-serif font-semibold text-black text-center">
                  {element.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Section */}
      <main
        className={`mainContent h-[80rem] w-full flex flex-col mt-28 transform transition-all duration-1000 ease-out ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* Content Info */}
        {mainContentHolder.map((item: mainContentInfo, index: number) => (
          <div className="contentInfo flex justify-evenly items-center h-[25%]" key={index}>
            {index % 2 === 0 ? (
              <>
                <img src={item.image} alt={item.title} className="h-[90%] w-auto bg-cover" />
                <div className="textInfo h-[100%] w-[30%] flex flex-col justify-center items-center">
                  <p className="text-2xl font-serif font-bold text-black pb-10">{item.title}</p>
                  <p className="text-md font-sans text-black text-center">{item.description}</p>
                </div>
              </>
            ) : (
              <>
                <div className="textInfo h-[100%] w-[30%] flex flex-col justify-center items-center">
                  <p className="text-2xl font-serif font-bold text-black pb-10">{item.title}</p>
                  <p className="text-md font-sans text-black text-center">{item.description}</p>
                </div>
                <img src={item.image} alt={item.title} className="h-[90%] w-auto bg-cover" />
              </>
            )}
          </div>
        ))}
      </main>

      <Footer />
    </>
  );
}
