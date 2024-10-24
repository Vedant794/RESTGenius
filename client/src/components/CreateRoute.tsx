import { useEffect, useState } from "react";
import { IoMdAdd, IoMdTrash } from "react-icons/io";
import useTheme from "./context/ModeContext";
import Navbar from "./Navbar";
import useRoute, { RouteContext } from "./context/routeContext";
import axios from "axios";
import useProjectName from "./context/projectNameContext";
import useSchema from "./context/schemaContext";
import useSchemaIndex from "./context/SchemaIndex";
import GetStarted from "./GetStarted";

function CreateRoute() {
  const {routes, setRoutes} = useRoute();
  const {mode} = useTheme()
  const {projectName} = useProjectName()
  const {schemas} = useSchema()
  const {ind} =useSchemaIndex()
  const [schemaName,setSchemaName]=useState("")

  type criteria = {
    targetVar: string;
    operationType: string;
    valueType: string;
  };

  useEffect(()=>{
    const savedRoutes=sessionStorage.getItem("routes")
    if(savedRoutes){
      setRoutes(JSON.parse(savedRoutes))
    }
  },[])

  useEffect(()=>{
    sessionStorage.setItem("routes",JSON.stringify(routes))
  },[routes])

  const handleAddRoutes = () => {
    setRoutes([
      ...routes,
      {
        url: "",
        service_name: "",
        controller_name: "",
        criterias: [],
      },
    ]);
  };

  const handleRemoveRoutes = (index: number) => {
    setRoutes(routes.filter((_, id) => id !== index));
  };
  //ROutes Functions Going on

  const handleUrlChange = (index: number, value: string) => {
    const updatedRoutes = [...routes];
    updatedRoutes[index].url = value;
    setRoutes(updatedRoutes);
  };

  const handleServiceChange = (index: number, value: string) => {
    const updatedRoutes = [...routes];
    updatedRoutes[index].service_name = value;
    setRoutes(updatedRoutes);
  };

  const handleControllerChange = (index: number, value: string) => {
    const updatedRoutes = [...routes];
    updatedRoutes[index].controller_name = value;
    setRoutes(updatedRoutes);
  };

  const handleCriteriaAddChange = (index: number) => {
    const upadtedRoutes = [...routes];
    upadtedRoutes[index].criterias.push({
      targetVar: "",
      operationType: "REGEX",
      valueType: "String",
    });
    setRoutes(upadtedRoutes);
  };

  const handleCriteriaChange = (
    routesIndex: number,
    criteriaInd: number,
    field: keyof criteria,
    value: any
  ) => {
    const updatedRoutes = [...routes];
    updatedRoutes[routesIndex].criterias[criteriaInd][field] = value;
    setRoutes(updatedRoutes);
  };

  const handleRemoveCriteria = (routesIndex: number, criteriaInd: number) => {
    const updatedRoutes = [...routes];
    updatedRoutes[routesIndex].criterias = updatedRoutes[
      routesIndex
    ].criterias.filter((criteria: criteria, idx: number) => idx != criteriaInd);

    setRoutes(updatedRoutes);
  };

  const handleSubmit=(e:React.FormEvent)=>{
    e.preventDefault()
    const routeData=routes

    localStorage.setItem("RoutesData",JSON.stringify(routeData))
    alert(`Your Routes for ${schemaName} Schema has been added`)
  }

  const handleRoutesToBackend=async()=>{
    try {
      const response=await axios.post(`http://localhost:3000/backend/addRoutes/${projectName}/${schemaName}`,{routes})
      // console.log(response.data);
      
    } catch (error) {
      console.error(error)
    }
  }

  const handleSchemaName=(name:string)=>{
    setSchemaName(name)
  }
  // console.log(ind)
  // console.log(routes)

  return (
    <div className="overflow-x-hidden">
    <RouteContext.Provider value={{routes,setRoutes}}>
      <Navbar/>
      <GetStarted/>
      <div className="container mx-auto p-4 -mt-[99vh] ml-60">
        <div className="routes">
          <div className="name flex justify-around">
            <h1 className="text-2xl font-bold mb-4">
              Create Routes
            </h1>
            <input
            type="text"
            placeholder="Enter Schema name for Which you want to make routes"
            onChange={(e)=>{
              handleSchemaName(e.target.value)
            }}
            className={`w-[27rem] p-2 ml-6 focus:outline-none border-b-2  ${mode ? 'border-black' : 'border-white bg-[#282929] text-white'}`}
            />

          </div>
          <div className="add-back flex justify-between items-center">
          <button
            onClick={handleAddRoutes}
            className={`h-auto w-auto text-lg flex justify-evenly items-center font-medium shadow-lg  ${mode?"shadow-slate-500":"shadow-black"} bg-blue-500 text-white px-4 py-2 mb-4 rounded-md`}
          >
            Add Routes <IoMdAdd />
          </button>

          </div>

          {routes.map((route, routeIndex) => (
            <div
              className={`createRoute shadow-custom-heavy ${mode?'bg-gray-100':'bg-[#202725] shadow-black'} p-4 mb-6 rounded-md`}
              key={routeIndex}
            >
              <form
               action=""
               onSubmit={(e)=>{
                handleSubmit(e);
                handleRoutesToBackend()
              }}
              >
              <input
                type="text"
                placeholder="Enter Url to be Generate"
                value={route.url}
                onChange={(e) => {
                  handleUrlChange(routeIndex, e.target.value);
                }}
                className={`w-full px-4 py-2 mb-4 rounded-md shadow-lg ${mode?'bg-white':'bg-[#282929] shadow-black'} focus:outline-none`}
              />

              <input
                type="text"
                placeholder="Enter Service Name"
                value={route.service_name}
                onChange={(e) => {
                  handleServiceChange(routeIndex, e.target.value);
                }}
                className={`w-full px-4 py-2 mb-4 rounded-md shadow-lg ${mode?'bg-white':'bg-[#282929] shadow-black'} focus:outline-none`}
              />

              <input
                type="text"
                placeholder="Enter Controller Name"
                value={route.controller_name}
                onChange={(e) => {
                  handleControllerChange(routeIndex, e.target.value);
                }}
                className={`w-full px-4 py-2 mb-4 rounded-md shadow-lg ${mode?'bg-white':'bg-[#282929] shadow-black'} focus:outline-none`}
              />

              <button
                type="button"
                onClick={() => handleCriteriaAddChange(routeIndex)}
                className="h-auto w-auto flex justify-evenly items-center text-lg font-medium shadow-xl bg-green-500 text-white px-4 py-2 mb-4 mt-2 rounded-md"
              >
                Add Criteria <IoMdAdd />
              </button>

              {route.criterias.map(
                (criteria: criteria, criteriaInd: number) => (
                  <div
                    key={criteriaInd}
                    className={`criteriaAdd p-4 mb-4 rounded-md shadow-xl`}
                  >
                    <input
                      type="text"
                      placeholder="Enter Target Name"
                      value={criteria.targetVar}
                      onChange={(e) => {
                        handleCriteriaChange(
                          routeIndex,
                          criteriaInd,
                          "targetVar",
                          e.target.value
                        );
                      }}
                      className={`w-full px-4 py-2 mb-4 rounded-md shadow-lg ${mode?'bg-white':'bg-[#282929] shadow-black'} focus:outline-none`}
                    />

                    <select
                      value={criteria.valueType}
                      onChange={(e) => {
                        handleCriteriaChange(
                          routeIndex,
                          criteriaInd,
                          "valueType",
                          e.target.value
                        );
                      }}
                      className={`w-full px-4 py-2 mb-4 rounded-md shadow-lg ${mode?'bg-white':'bg-[#282929] shadow-black'} focus:outline-none`}
                    >
                      <option value="Integer">Integer</option>
                      <option value="String">String</option>
                    </select>

                    {criteria.valueType === "String" ? (
                      <>
                        <select
                          value={criteria.operationType}
                          onChange={(e) => {
                            handleCriteriaChange(
                              routeIndex,
                              criteriaInd,
                              "operationType",
                              e.target.value
                            );
                          }}
                          className={`w-full px-4 py-2 mb-4 rounded-md shadow-lg ${mode?'bg-white':'bg-[#282929] shadow-black'} focus:outline-none`}
                        >
                          <option value="EXACT_MATCH">EXACT_MATCH</option>
                          <option value="REGEX">REGEX</option>
                          <option value="FULL_TEXT">FULL_TEXT</option>
                        </select>
                      </>
                    ) : (
                      <>
                        <select
                         value={criteria.operationType}
                         onChange={(e)=>{
                            handleCriteriaChange(routeIndex,criteriaInd,"operationType",e.target.value)
                         }}
                         className={`w-full px-4 py-2 mb-4 rounded-md shadow-lg ${mode?'bg-white':'bg-[#282929] shadow-black'} focus:outline-none`}
                        >
                            <option value="LESS_THAN">LESS_THAN</option>
                            <option value="GREATER_THAN">GREATER_THAN</option>
                            <option value="BETWEEN">BETWEEN</option>
                            <option value="EQUAL_TO">EQUAL_TO</option>
                        </select>
                      </>
                    )}
                    <button
                     type="button"
                     onClick={()=>handleRemoveCriteria(routeIndex,criteriaInd)}
                     className="h-auto w-auto flex justify-evenly items-center mt-4 text-lg font-medium bg-red-500 text-white px-2 py-1 rounded-md"
                    >
                        Delete Criteria <IoMdTrash/>
                    </button>
                  </div>
                )
              )}
              <div className="relation flex justify-between items-center">
              <button
               type="button"
               onClick={()=>handleRemoveRoutes(routeIndex)}
               className="h-auto w-auto flex justify-evenly items-center text-lg font-medium shadow-xl bg-red-600 text-white px-4 py-2 rounded-md mt-4"
              >
                Delete Route <IoMdTrash/>
              </button>

              


              </div>
              <div className="done flex justify-end mx-7">
        <button
         type="submit"
         className={`h-auto w-auto text-lg font-medium shadow-lg  ${mode?"shadow-slate-500":"shadow-black"} bg-blue-500 text-white px-4 py-2 mb-4 rounded-md`}
        >
          Done
        </button>
      </div>
              </form>
            </div>
          ))}
        </div>
      </div>

      
    </RouteContext.Provider>
    </div>
  );
}

export default CreateRoute;
