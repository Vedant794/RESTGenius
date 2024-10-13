import { useEffect, useState } from "react";
import { IoMdAdd, IoMdTrash } from "react-icons/io";
import useTheme from "./context/ModeContext";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";
import { RelationContext } from "./context/relationContext";

function CreateRelations() {
  const [relation, setRelation] = useState<any[]>([]);
  const {mode} = useTheme()
  const navigate=useNavigate()

  useEffect(()=>{
    const savedRoutes=sessionStorage.getItem("routes")
    if(savedRoutes){
      setRelation(JSON.parse(savedRoutes))
    }
  },[])

  useEffect(()=>{
    sessionStorage.setItem("routes",JSON.stringify(relation))
  },[relation])

  //Relation Functions going on

  const handleAddRelation = () => {
    setRelation([
      ...relation,
      {
        schema: "",
        target: "",
        lazyLoad: "",
        type: "",
      },
    ]);
  };

  const handleRemoveRelations = (index: number) => {
    setRelation(relation.filter((_, idx) => idx !== index));
  };

  const handleSchemaChange = (index: number, value: string) => {
    const updatedRelation = [...relation];
    updatedRelation[index].schema = value;
    setRelation(updatedRelation);
  };

  const handleTargetChange = (index: number, value: string) => {
    const updatedRelation = [...relation];
    updatedRelation[index].target = value;
    setRelation(updatedRelation);
  };

  const handleLazyLoadChange = (index: number, value: string) => {
    const updatedRelation = [...relation];
    updatedRelation[index].lazyLoad = value;
    setRelation(updatedRelation);
  };

  const handleTypeChange = (index: number, value: string) => {
    const updatedRelation = [...relation];
    updatedRelation[index].type = value;
    setRelation(updatedRelation);
  };

  const handleBack=()=>{
    navigate('/getstarted/customSchema/routes')
  }

  return(
    <RelationContext.Provider value={{relation,setRelation}}>
    <Navbar/>
        <div className="container mx-auto p-4 my-[13vh]">
            <div className="relations">
                <h1 className="text-2xl font-bold mb-4">Create Relations Between Schemas</h1>
                <div className="back flex justify-between items-center">
                  <button
                  onClick={handleBack}
                  className="h-auto w-auto flex justify-evenly items-center text-lg font-medium shadow-xl bg-gray-500 text-white px-4 py-2 rounded-md mb-2"
                  >
                    Back
                  </button>
                <button
                 onClick={handleAddRelation}
                 className={`h-auto w-auto text-lg flex justify-evenly items-center font-medium shadow-lg  ${mode?"shadow-slate-500":"shadow-black"} bg-blue-500 text-white px-4 py-2 mb-4 rounded-md`}
                >
                    Add Relations<IoMdAdd/>
                </button>
                </div>

                {relation.map((relation,relationInd)=>(
                    <div
                     key={relationInd}
                     className={`relationContent shadow-custom-heavy ${mode?'bg-gray-100':'bg-[#202725] shadow-black'} p-4 mb-6 rounded-md`}>
                        <input
                         type="text"
                         placeholder="Enter Schema Name"
                         value={relation.schema}
                         onChange={(e)=>{
                            handleSchemaChange(relationInd,e.target.value)
                         }}
                         className={`w-full px-4 py-2 mb-4 rounded-md shadow-lg ${mode?'bg-white':'bg-[#282929] shadow-black'} focus:outline-none`} 
                        />

                        <input
                          type="text"
                          placeholder="Enter Target Entity"
                          value={relation.target}
                          onChange={(e)=>{
                            handleTargetChange(relationInd,e.target.value)
                          }}
                          className={`w-full px-4 py-2 mb-4 rounded-md shadow-lg ${mode?'bg-white':'bg-[#282929] shadow-black'} focus:outline-none`}
                        />

                        <select
                           value={relation.lazyLoad}
                           onChange={(e)=>[
                            handleLazyLoadChange(relationInd,e.target.value)
                           ]}
                           className={`w-full px-4 py-2 mb-4 rounded-md shadow-lg ${mode?'bg-white':'bg-[#282929] shadow-black'} focus:outline-none`}
                        >
                            <option value="true">True</option>
                            <option value="false">False</option>
                        </select>
                        <select
                         value={relation.type}
                         onChange={(e)=>{
                            handleTypeChange(relationInd,e.target.value)
                         }}
                         className={`w-full px-4 py-2 mb-4 rounded-md shadow-lg ${mode?'bg-white':'bg-[#282929] shadow-black'} focus:outline-none`}
                        >
                            <option value="one-to-one">One-to-One</option>
                            <option value="one-to-many">One-to-Many</option>
                        </select>

                        <button 
                         onClick={()=>handleRemoveRelations(relationInd)}
                         className="h-auto w-auto flex justify-evenly items-center text-lg font-medium shadow-xl bg-red-600 text-white px-4 py-2 rounded-md mt-4"
                        >
                            Delete Relation <IoMdTrash/>
                        </button>
                    </div>
                ))}
            </div>
        </div>
    </RelationContext.Provider>
  )
}

export default CreateRelations;
