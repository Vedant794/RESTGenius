import { useEffect, useState } from "react";
import { IoMdAdd, IoMdTrash } from "react-icons/io";
import useTheme from "./context/ModeContext";
import Navbar from "./Navbar";
import useRoute, { RouteContext } from "./context/routeContext";
import axios from "axios";
import useProjectName from "./context/projectNameContext";
import GetStarted from "./GetStarted";

function CreateRoute() {
  interface schemaType {
    schema_name: "";
    schema_dbname: "";
    attributes: [];
    routes: [];
    _id: "";
    relation: [];
  }

  interface routeType {
    url: "";
    service_name: "";
    controller_name: "";
    criterias: [];
  }

  interface routeWithId {
    url: "";
    service_name: "";
    controller_name: "";
    criterias: [];
    _id: "";
  }

  const { routes, setRoutes } = useRoute();
  const { mode } = useTheme();
  const { projectName } = useProjectName();
  const [schemas, setSchema] = useState<schemaType[]>([]);
  const [schemaName, setSchemaName] = useState("");
  const [errors, setErrors] = useState(false);
  const [routeStore, setRouteStore] = useState<routeType[]>([]);

  type criteria = {
    targetVar: string;
    operationType: string;
    valueType: string;
  };

  useEffect(() => {
    const savedRoutes = sessionStorage.getItem("routes");
    if (savedRoutes) {
      setRoutes(JSON.parse(savedRoutes));
    }
  }, []);

  useEffect(() => {
    sessionStorage.setItem("routes", JSON.stringify(routes));
  }, [routes]);

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

  type routeWithout = Omit<routeWithId, "_id">;
  const handleGetSchemas = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/backend/getProjectData/${projectName}`
      );
      const dataSchema = response.data.projectData.schemas;
      setSchema(dataSchema);

      const allRoutes: routeWithout[] = [];
      dataSchema.map((schema: schemaType) => {
        const fetchedData: routeWithout[] = schema.routes.map(
          (route: routeWithId) => {
            const { _id, ...rest } = route; // Remove _id from each route
            return rest;
          }
        );
        allRoutes.push(...fetchedData);
      });
      setRouteStore(allRoutes);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    handleGetSchemas();
  }, [projectName]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (schemaName.length == 0) {
      setErrors(true);
    } else {
      const routeData = routes;

      localStorage.setItem("RoutesData", JSON.stringify(routeData));
      alert(`Your Routes for ${schemaName} Schema has been added`);
      handleRoutesToBackend();
      setRoutes([]);
      handleGetSchemas();
    }
  };

  const handleRoutesToBackend = async () => {
    try {
      const response = await axios.post(
        `http://localhost:3000/backend/addRoutes/${projectName}/${schemaName}`,
        { routes }
      );
      // console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSchemaName = (name: string) => {
    setSchemaName(name);
  };
  // console.log(routes)
  // console.log(schemas)

  return (
    <div className="">
      <RouteContext.Provider value={{ routes, setRoutes }}>
        <Navbar />
        <GetStarted />
        <div className="container mx-auto p-4 -mt-[99vh] ml-52">
          <div className="routes ml-20">
            <h1 className="text-2xl font-bold mb-4">Create Routes</h1>
            <div className="add-back flex justify-between items-center">
              <button
                onClick={handleAddRoutes}
                className={`h-auto w-auto text-lg flex justify-evenly items-center font-medium shadow-lg  ${mode ? "shadow-slate-500" : "shadow-black"} bg-blue-500 text-white px-4 py-2 mb-4 rounded-md`}
              >
                Add Routes <IoMdAdd />
              </button>
            </div>
            {routeStore.length > 0 && (
              <div className="outputDesc w-full h-auto px-2 py-4 shadow-lg">
                <h2 className="">User Defined Routes</h2>
                {routeStore.map((route, index) => (
                  <div
                    key={index}
                    className="font-popins flex justify-between items-center font-medium text-xl px-4 mb-2"
                  >
                    <span>
                      {index + 1}. {route.controller_name ?? "No Data"}
                    </span>
                  </div>
                ))}
              </div>
            )}
            {routes.map((route, routeIndex) => (
              <div
                className={`createRoute w-[60vw] ml-36 shadow-custom-heavy ${mode ? "bg-gray-100" : "bg-[#202725] shadow-black"} p-4 mb-6 rounded-md`}
                key={routeIndex}
              >
                <form action="" onSubmit={handleSubmit}>
                  <select
                    onChange={(e) => {
                      handleSchemaName(e.target.value);
                    }}
                    className={`w-full px-4 py-2 mb-4 rounded-md shadow-lg ${mode ? "bg-white" : "bg-[#282929] shadow-black"} focus:outline-none`}
                  >
                    <option value={""}>Select Schema for routes</option>
                    {schemas.map((val) => (
                      <option value={val.schema_name}>{val.schema_name}</option>
                    ))}
                  </select>
                  <input
                    type="text"
                    placeholder="Enter Url to be Generate"
                    value={route.url}
                    onChange={(e) => {
                      handleUrlChange(routeIndex, e.target.value);
                    }}
                    className={`w-full px-4 py-2 mb-4 rounded-md shadow-lg ${mode ? "bg-white" : "bg-[#282929] shadow-black"} focus:outline-none`}
                  />

                  <input
                    type="text"
                    placeholder="Enter Service Name"
                    value={route.service_name}
                    onChange={(e) => {
                      handleServiceChange(routeIndex, e.target.value);
                    }}
                    className={`w-full px-4 py-2 mb-4 rounded-md shadow-lg ${mode ? "bg-white" : "bg-[#282929] shadow-black"} focus:outline-none`}
                  />

                  <input
                    type="text"
                    placeholder="Enter Controller Name"
                    value={route.controller_name}
                    onChange={(e) => {
                      handleControllerChange(routeIndex, e.target.value);
                    }}
                    className={`w-full px-4 py-2 mb-4 rounded-md shadow-lg ${mode ? "bg-white" : "bg-[#282929] shadow-black"} focus:outline-none`}
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
                        className={`criteriaAdd p-4 mb-3 rounded-md shadow-xl`}
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
                          className={`w-full px-4 py-2 mb-4 rounded-md shadow-lg ${mode ? "bg-white" : "bg-[#282929] shadow-black"} focus:outline-none`}
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
                          className={`w-full px-4 py-2 mb-4 rounded-md shadow-lg ${mode ? "bg-white" : "bg-[#282929] shadow-black"} focus:outline-none`}
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
                              className={`w-full px-4 py-2 mb-4 rounded-md shadow-lg ${mode ? "bg-white" : "bg-[#282929] shadow-black"} focus:outline-none`}
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
                              onChange={(e) => {
                                handleCriteriaChange(
                                  routeIndex,
                                  criteriaInd,
                                  "operationType",
                                  e.target.value
                                );
                              }}
                              className={`w-full px-4 py-2 mb-4 rounded-md shadow-lg ${mode ? "bg-white" : "bg-[#282929] shadow-black"} focus:outline-none`}
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
                          onClick={() =>
                            handleRemoveCriteria(routeIndex, criteriaInd)
                          }
                          className="h-auto w-auto flex justify-evenly items-center mt-4 text-lg font-medium bg-red-500 text-white px-2 py-1 rounded-md"
                        >
                          Delete Criteria <IoMdTrash />
                        </button>
                      </div>
                    )
                  )}
                  <div className="relation flex justify-between items-center">
                    <button
                      type="button"
                      onClick={() => handleRemoveRoutes(routeIndex)}
                      className="h-auto w-auto flex justify-evenly items-center text-lg font-medium shadow-xl bg-red-600 text-white px-4 py-2 rounded-md mt-2"
                    >
                      Delete Route <IoMdTrash />
                    </button>
                    <button
                      type="submit"
                      className={`h-auto w-auto text-lg font-medium shadow-lg  ${mode ? "shadow-slate-500" : "shadow-black"} bg-blue-500 text-white px-4 py-2 rounded-md`}
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
