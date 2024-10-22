import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaCode, FaDatabase, FaServer } from "react-icons/fa";
import { GiBrain, GiShuriken } from "react-icons/gi";
import { MdApi } from "react-icons/md";
import { AnimatePresence } from "framer-motion";
import GetStarted from "./GetStarted";
import Navbar from "./Navbar";

interface Slide {
  title: string;
  description: string;
  button: string;
  url: string;
}

const Introduction: React.FC = () => {
  const [showContent, setShowContent] = useState(false);
  const [showCodeSample, setShowCodeSample] = useState(false);
  const [slideIndex, setSlideIndex] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  const slides: Slide[] = [
    {
      title: "API Schema",
      description: "Comprehensively define your RESTful service using a user-friendly JSON structure.",
      button: "Get Started",
      url: "#"
    },
    {
      title: "Smart Defaults",
      description: "Begin by outlining your data models. Then, link these models to endpoints that provide the specific functionalities you wish to offer.",
      button: "Learn More",
      url: "#"
    },
    {
      title: "Native SDKs",
      description: "Access native SDKs with few (if any) external dependencies. We've put significant effort into ensuring these SDKs are intuitive and enjoyable to work with.",
      button: "Explore SDKs",
      url: "#"
    }
  ];

  const variants = {
    hidden: { opacity: 0, y: -50 },
    visible: { opacity: 1, y: 0 },
    slideIn: { x: 0, transition: { type: "spring", stiffness: 300, damping: 30 } },
    slideOut: { x: -100, transition: { duration: 0.5 } }
  };

  const handleUpdateUser = async (userId: string, updatedData: any) => {
    const response = await fetch(`/api/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(updatedData),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.json();
  }

  return (
    <div className="overflow-x-hidden">
    <Navbar/>
    <GetStarted/>
    <div className="container -mt-[99vh] ml-[14.8rem] px-4 py-8">
      <motion.div
        initial="hidden"
        animate={showContent ? "visible" : "hidden"}
        variants={variants}
        transition={{ delay: 0.5 }}
        className="bg-white p-6 text-center"
      >
        <h1 className="text-3xl font-bold mb-4 text-blue-600">API Architect</h1>
        <AnimatePresence mode="wait">
          <motion.section
            key={slideIndex}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={variants}
            transition={{ delay: 0.75 }}
          >
            <h2 className="text-2xl font-semibold mb-2 text-gray-800">{slides[slideIndex].title}</h2>
            <p className="mb-4 text-gray-600">{slides[slideIndex].description}</p>
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href={slides[slideIndex].url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4 transition-colors duration-300"
            >
              {slides[slideIndex].button}
            </motion.a>
          </motion.section>
        </AnimatePresence>

        {/* Info Graphics */}
        <div className="mt-8 space-y-4">
          <motion.div
            initial="hidden"
            animate={showContent ? "visible" : "hidden"}
            variants={variants}
            transition={{ delay: 1 }}
            className="flex items-center justify-center bg-gray-100 p-4 rounded-lg"
          >
            <FaDatabase className="text-4xl text-green-400 mr-2" />
            <span className="font-medium">100% RESTful</span>
          </motion.div>
          <motion.div
            initial="hidden"
            animate={showContent ? "visible" : "hidden"}
            variants={variants}
            transition={{ delay: 1.25 }}
            className="flex items-center justify-center bg-gray-100 p-4 rounded-lg"
          >
            <GiBrain className="text-4xl text-yellow-400 mr-2" />
            <span className="font-medium">Smart Defaults</span>
          </motion.div>
          <motion.div
            initial="hidden"
            animate={showContent ? "visible" : "hidden"}
            variants={variants}
            transition={{ delay: 1.5 }}
            className="flex items-center justify-center bg-gray-100 p-4 rounded-lg"
          >
            <MdApi className="text-4xl text-purple-400 mr-2" />
            <span className="font-medium">API First</span>
          </motion.div>
        </div>

        {/* Sample API Code */}
        <motion.div
          initial="hidden"
          animate={showCodeSample ? "visible" : "hidden"}
          variants={variants}
          transition={{ delay: 1.75 }}
          className="mt-8 bg-gray-100 p-4 rounded-lg"
        >
          <h3 className="text-xl font-semibold mb-2 text-gray-800">Generated API Code Sample</h3>
          <pre className="overflow-x-auto border-l-2 border-gray-300 pr-4">
            {/* Add your sample code here */}
          </pre>
          <a href="#" className="block mt-2 text-blue-500 hover:text-blue-700 transition-colors duration-300">View Source</a>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial="hidden"
          animate={showContent ? "visible" : "hidden"}
          variants={variants}
          transition={{ delay: 2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8"
        >
          <motion.div
            variants={variants}
            transition={{ delay: 2.25 }}
            className="bg-white rounded-lg shadow-md p-4 text-center"
          >
            <h3 className="text-xl font-semibold mb-2 text-gray-800">API Schema</h3>
            <p className="mb-4 text-gray-600">Define your RESTful service using a user-friendly JSON structure.</p>
            <ul className="space-y-2">
              <li className="flex items-center"><FaServer className="text-2xl text-blue-500 mr-2" /> RESTful Architecture</li>
              <li className="flex items-center"><FaDatabase className="text-2xl text-green-500 mr-2" /> Data Modeling</li>
              <li className="flex items-center"><GiShuriken className="text-2xl text-red-500 mr-2" /> Customizable Endpoints</li>
            </ul>
          </motion.div>
          <motion.div
            variants={variants}
            transition={{ delay: 2.5 }}
            className="bg-white rounded-lg shadow-md p-4 text-center"
          >
            <h3 className="text-xl font-semibold mb-2 text-gray-800">Smart Defaults</h3>
            <p className="mb-4 text-gray-600">Encourages thoughtful API design with simplified complex setups.</p>
            <ul className="space-y-2">
              <li className="flex items-center"><FaCode className="text-2xl text-green-500 mr-2" /> Auto-generated Documentation</li>
              <li className="flex items-center"><GiBrain className="text-2xl text-yellow-400 mr-2" /> Intelligent Suggestions</li>
              <li className="flex items-center"><MdApi className="text-2xl text-purple-500 mr-2" /> API Versioning</li>
            </ul>
          </motion.div>
          <motion.div
            variants={variants}
            transition={{ delay: 2.75 }}
            className="bg-white rounded-lg shadow-md p-4 text-center"
          >
            <h3 className="text-xl font-semibold mb-2 text-gray-800">Native SDKs</h3>
            <p className="mb-4 text-gray-600">Intuitive and lightweight SDKs with minimal dependencies.</p>
            <ul className="space-y-2">
              <li className="flex items-center"><FaDatabase className="text-2xl text-blue-500 mr-2" /> Database Integration</li>
              <li className="flex items-center"><GiShuriken className="text-2xl text-red-500 mr-2" /> Security Features</li>
              <li className="flex items-center"><MdApi className="text-2xl text-purple-500 mr-2" /> Real-time Updates</li>
            </ul>
          </motion.div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial="hidden"
          animate={showContent ? "visible" : "hidden"}
          variants={variants}
          transition={{ delay: 2.25 }}
          className="mt-8 bg-white rounded-lg shadow-md p-4 text-center"
        >
                    <h2 className="text-2xl font-semibold mb-4 text-gray-800">Stats</h2>
          <ul className="space-y-4">
            <li className="flex flex-col items-center">
              <span className="text-4xl font-bold text-blue-500">{1000 + Math.floor(Math.random() * 900)}</span>
              <span className="text-sm text-gray-600">APIs Generated Daily</span>
            </li>
            <li className="flex flex-col items-center">
              <span className="text-4xl font-bold text-green-500">{5000 + Math.floor(Math.random() * 4000)}</span>
              <span className="text-sm text-gray-600">Developers Worldwide</span>
            </li>
            <li className="flex flex-col items-center">
              <span className="text-4xl font-bold text-purple-500">{200 + Math.floor(Math.random() * 100)}</span>
              <span className="text-sm text-gray-600">Integrations Supported</span>
            </li>
          </ul>
        </motion.div>
      </motion.div>
    </div>
    </div>
  );
};

export default Introduction;
