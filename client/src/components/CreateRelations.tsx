import { useEffect, useState } from "react";
import { IoMdAdd, IoMdTrash } from "react-icons/io";
import useTheme from "./context/ModeContext";
import Navbar from "./Navbar";
import useRelation, { RelationContext } from "./context/relationContext";
import GetStarted from "./GetStarted";
import axios from "axios";
import useProjectName from "./context/projectNameContext";
import useSchema from "./context/schemaContext";

function CreateRelations() {
  const { relation, setRelation } = useRelation();
  const { mode } = useTheme();
  const [schemaName, setSchemaName] = useState("");
  const [errors,setErrors] = useState(false)
  const { projectName } = useProjectName();
  const {schemas} = useSchema()

  useEffect(() => {
    const savedRoutes = localStorage.getItem("relation");
    if (savedRoutes) {
      setRelation(JSON.parse(savedRoutes));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("relation", JSON.stringify(relation));
  }, [relation]);

  const handleAddRelation = () => {
    setRelation([
      ...relation,
      {
        schema: "",
        target: "",
        lazyLoad: false,  // Default boolean value
        type: "one-to-one" // Default type
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

  const handleLazyLoadChange = (index: number, value: boolean) => {
    const updatedRelation = [...relation];
    updatedRelation[index].lazyLoad = value;
    setRelation(updatedRelation);
  };

  const handleTypeChange = (index: number, value: string) => {
    const updatedRelation = [...relation];
    updatedRelation[index].type = value;
    setRelation(updatedRelation);
  };

  const handleRelationToBackend = async () => {
    try {
      const response = await axios.post(
        `http://localhost:3000/backend/addRelation/${projectName}/${schemaName}`,
        { relation }
      );
      console.log(response.status);
    } catch (error) {
      console.error("Error adding relation to backend:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if(schemaName.length==0){
      setErrors(true)
    }else{
      setErrors(false)  
      await handleRelationToBackend();
    }

  };

  const handleSchemaName = (name: string) => {
    setSchemaName(name);
  };

  // console.log(relation)

  return (
    <RelationContext.Provider value={{ relation, setRelation }}>
      <Navbar />
      <GetStarted />
      <div className="container mx-auto p-4 -my-[99vh] ml-60">
        <div className="relations">
          <div className="name flex justify-around items-center">
            <h1 className="text-2xl font-bold mb-4">Create Relations Between Schemas</h1>
            <div className="selectSchema">
            <select
             onChange={(e)=>{
              handleSchemaName(e.target.value)
            }}
            className={`w-[25rem] rounded-xl ${mode ? 'bg-slate-100 text-black' : 'bg-[#282929] text-white shadow-black'} p-3 focus:outline-none mt-3 shadow-xl cursor-pointer`}
            >
              <option value="">Select the schema for relations</option>
              {schemas.map((val)=>(
                <option value={val.schema_name}>{val.schema_name}</option>
              ))}
            </select>
            {errors ? <div className="text-red-600 mt-2">*The schema Should be Select for Relations</div> : <></>}
            </div>
          </div>
          <div className="back flex justify-between items-center">
            <button
              onClick={handleAddRelation}
              className={`h-auto w-auto text-lg flex justify-evenly items-center font-medium shadow-lg ${mode ? "shadow-slate-500" : "shadow-black"} bg-blue-500 text-white px-4 py-2 mb-4 rounded-md`}
            >
              Add Relations<IoMdAdd />
            </button>
          </div>

          {relation.map((relation, relationInd) => (
            <div
              key={relationInd}
              className={`relationContent shadow-custom-heavy ${mode ? 'bg-gray-100' : 'bg-[#202725] shadow-black'} p-4 mb-6 rounded-md`}
            >
              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  placeholder="Enter Schema Name"
                  value={relation.schema}
                  onChange={(e) => handleSchemaChange(relationInd, e.target.value)}
                  className={`w-full px-4 py-2 mb-4 rounded-md shadow-lg ${mode ? 'bg-white' : 'bg-[#282929] shadow-black'} focus:outline-none`}
                />

                <input
                  type="text"
                  placeholder="Enter Target Entity"
                  value={relation.target}
                  onChange={(e) => handleTargetChange(relationInd, e.target.value)}
                  className={`w-full px-4 py-2 mb-4 rounded-md shadow-lg ${mode ? 'bg-white' : 'bg-[#282929] shadow-black'} focus:outline-none`}
                />
                <div className="lazyload ml-2">
                <label>Select LazyLoad:-</label>
                <select
                  value={relation.lazyLoad.toString()} // Convert boolean to string
                  onChange={(e) => handleLazyLoadChange(relationInd, e.target.value === 'true')}
                  className={`w-[70%] ml-3 px-4 py-2 mb-4 cursor-pointer rounded-md shadow-lg ${mode ? 'bg-white' : 'bg-[#282929] shadow-black'} focus:outline-none`}
                >
                  <option value="true">True</option>
                  <option value="false">False</option>
                </select>

                </div>
                <div className="type ml-2">
                  <label>Select Relation Type:-</label>
                <select
                  value={relation.type}
                  onChange={(e) => handleTypeChange(relationInd, e.target.value)}
                  className={`w-[70%] ml-3 px-4 py-2 mb-4 cursor-pointer rounded-md shadow-lg ${mode ? 'bg-white' : 'bg-[#282929] shadow-black'} focus:outline-none`}
                >
                  <option value="one-to-one">One-to-One</option>
                  <option value="one-to-many">One-to-Many</option>
                </select>

                </div>
                <div className="navBtn flex justify-between items-center">
                  <button
                    type="button"
                    onClick={() => handleRemoveRelations(relationInd)}
                    className="h-auto w-auto flex justify-evenly items-center text-lg font-medium shadow-xl bg-red-600 text-white px-4 py-2 rounded-md mt-4"
                  >
                    Delete Relation <IoMdTrash />
                  </button>
                  <button
                    type="submit"
                    className={`h-auto w-auto text-lg font-medium shadow-lg ${mode ? "shadow-slate-500" : "shadow-black"} bg-blue-500 text-white px-4 py-2 mb-4 rounded-md`}
                  >
                    Done
                  </button>
                </div>
              </form>
            </div>
          ))}
        </div>
      </div>
      <pre>{JSON.stringify({ relation }, null, 2)}</pre>
    </RelationContext.Provider>
  );
}

export default CreateRelations;
