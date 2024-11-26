import { useEffect, useState } from "react";
import { IoMdAdd, IoMdTrash } from "react-icons/io";
import useTheme from "./context/ModeContext";
import Navbar from "./Navbar";
import useRelation, { RelationContext } from "./context/relationContext";
import GetStarted from "./GetStarted";
import axios from "axios";
import useProjectName from "./context/projectNameContext";

function CreateRelations() {
  interface schemaType {
    schema_name: "";
    schema_dbname: "";
    attributes: [];
    routes: [];
    _id: "";
    relation: [];
  }

  interface relationType {
    schema: string;
    target: string;
    lazyLoad: boolean;
    type: string;
    lazySave: boolean;
    cascadeDelete: boolean;
  }

  interface relationWithId {
    schema: string;
    target: string;
    lazyLoad: boolean;
    type: string;
    lazySave: boolean;
    cascadeDelete: boolean;
    _id: string;
  }

  const { relation, setRelation } = useRelation();
  const { mode } = useTheme();
  const [schemaName, setSchemaName] = useState("");
  const { projectName } = useProjectName();
  const [schemas, setSchema] = useState<schemaType[]>([]);
  const [relate, setRelate] = useState<relationType[]>([]);

  useEffect(() => {
    const savedRelation = sessionStorage.getItem("relation");
    if (savedRelation) {
      setRelation(JSON.parse(savedRelation));
    }
  }, []);

  useEffect(() => {
    sessionStorage.setItem("relation", JSON.stringify(relation));
  }, [relation]);

  const handleAddRelation = () => {
    setRelation([
      ...relation,
      {
        schema: "select",
        target: "select",
        lazyLoad: false, // Default boolean value
        type: "OneToOne", // Default type
        lazySave: false, // Default boolean value
        cascadeDelete: false, // Default boolean value
      },
    ]);
  };

  type relationWithoutID = Omit<relationWithId, "_id">;

  const handleGetSchemas = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/backend/getProjectData/${projectName}`
      );
      const dataSchema = response.data.projectData.schemas;
      setSchema(dataSchema);

      // Accumulate relations from all schemas
      const allRelations: relationWithoutID[] = [];

      dataSchema.map((schema: schemaType) => {
        const fetchedData: relationWithoutID[] = schema.relation.map(
          (relation: relationWithId) => {
            const { _id, ...rest } = relation; // Remove _id from each relation
            return rest;
          }
        );
        allRelations.push(...fetchedData); // Add relations from this schema
      });

      setRelate(allRelations); // Set all relations at once
    } catch (error) {
      console.error(error);
    }
  };

  // console.log(schemas[0].relation);
  useEffect(() => {
    handleGetSchemas();
  }, [projectName]);

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

  const handlelazySaveChange = (index: number, value: boolean) => {
    const updatedRelation = [...relation];
    updatedRelation[index].lazySave = value;
    setRelation(updatedRelation);
  };

  const handleCascadeDeleteChange = (index: number, value: boolean) => {
    const updatedRelation = [...relation];
    updatedRelation[index].cascadeDelete = value;
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

    localStorage.setItem("relation", JSON.stringify(relation));

    alert(`Your Relations for ${schemaName} Schema has been added`);
    await handleRelationToBackend();
    setRelation([]);
    handleGetSchemas();
  };

  // console.log(relation);
  // console.log(schemaName);
  // console.log(relate);

  return (
    <RelationContext.Provider value={{ relation, setRelation }}>
      <Navbar />
      <GetStarted />
      <div className="container mx-auto p-4 -my-[99vh] ml-56">
        <div className="relations ml-20">
          {/* <div className="name flex justify-around items-center"> */}
          <h1 className="text-2xl font-bold mb-4">
            Create Relations Between Schemas
          </h1>
          <div className="back flex justify-between items-center">
            <button
              onClick={handleAddRelation}
              className={`h-auto w-auto text-lg flex justify-evenly items-center font-medium shadow-lg ${mode ? "shadow-slate-500" : "shadow-black"} bg-blue-500 text-white px-4 py-2 mb-4 rounded-md`}
            >
              Add Relations
              <IoMdAdd />
            </button>
          </div>
          {relate.length > 0 && (
            <div className="outputDesc w-full h-auto px-2 py-4 shadow-lg">
              <h2 className="">User Defined Relations</h2>
              {relate.map((relation, index) => (
                <div
                  key={index}
                  className="font-popins flex justify-between items-center font-medium text-xl px-4 mb-2"
                >
                  <span>
                    {index + 1}. {relation.schema ?? "No Data"}
                  </span>
                  {/* <img
                    src={deleteIcon}
                    alt="Delete"
                    width={30}
                    height={30}
                    className="cursor-pointer"
                  /> */}
                </div>
              ))}
            </div>
          )}

          {relation.map((relation, relationInd) => (
            <div
              key={relationInd}
              className={`relationContent w-[50vw] mt-8 ml-32 shadow-custom-heavy ${mode ? "bg-gray-100" : "bg-[#202725] shadow-black"} p-4 mb-6 `}
            >
              <form onSubmit={handleSubmit}>
                <div className="select">
                  <span className="font-popins">Select Schema:-</span>
                  <select
                    value={relation.schema}
                    onChange={(e) => {
                      handleSchemaChange(relationInd, e.target.value);
                      setSchemaName(e.target.value);
                    }}
                    className={`w-[60%] ml-3 px-4 py-2 mb-4 rounded-md shadow-lg ${mode ? "bg-white" : "bg-[#282929] shadow-black"} focus:outline-none`}
                  >
                    <option value={""}>Select</option>
                    {schemas.map((val, ind) => (
                      <option key={ind} value={val.schema_name}>
                        {val.schema_name}
                      </option>
                    ))}
                  </select>
                </div>

                <span className="font-popins">
                  Select Schema to be target:-
                </span>
                <select
                  value={relation.target}
                  onChange={(e) =>
                    handleTargetChange(relationInd, e.target.value)
                  }
                  className={`w-[60%] ml-3 px-4 py-2 mb-4 rounded-md shadow-lg ${mode ? "bg-white" : "bg-[#282929] shadow-black"} focus:outline-none`}
                >
                  <option value={""}>Select</option>
                  {schemas.map((val, ind) => (
                    <option key={ind} value={val.schema_name}>
                      {val.schema_name}
                    </option>
                  ))}
                </select>

                <div className="lazyload ml-2">
                  <label className="font-popins">Select LazyLoad:-</label>
                  <select
                    value={relation.lazyLoad.toString()} // Convert boolean to string
                    onChange={(e) =>
                      handleLazyLoadChange(
                        relationInd,
                        e.target.value === "true"
                      )
                    }
                    className={`w-[60%] ml-3 px-4 py-2 mb-4 cursor-pointer rounded-md shadow-lg ${mode ? "bg-white" : "bg-[#282929] shadow-black"} focus:outline-none`}
                  >
                    <option value="true">True</option>
                    <option value="false">False</option>
                  </select>
                </div>
                <div className="type ml-2">
                  <label className="font-popins">Select Relation Type:-</label>
                  <select
                    value={relation.type}
                    onChange={(e) =>
                      handleTypeChange(relationInd, e.target.value)
                    }
                    className={`w-[60%] ml-3 px-4 py-2 mb-4 cursor-pointer rounded-md shadow-lg ${mode ? "bg-white" : "bg-[#282929] shadow-black"} focus:outline-none`}
                  >
                    <option value="OneToOne">One-to-One</option>
                    <option value="OneToMany">One-to-Many</option>
                    <option value="ManyToMany">Many-to-Many</option>
                  </select>
                </div>
                <div className="boxes flex flex-col ml-3 space-y-2 mb-2">
                  <div>
                    <input
                      type="checkbox"
                      onChange={() =>
                        handlelazySaveChange(relationInd, !relation.lazySave)
                      }
                    />
                    <span className="ml-2 font-sour">lazySave</span>
                  </div>
                  <div>
                    <input
                      type="checkbox"
                      onChange={() =>
                        handleCascadeDeleteChange(
                          relationInd,
                          !relation.cascadeDelete
                        )
                      }
                    />
                    <span className="ml-2 font-sour">cascadeDelete</span>
                  </div>
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
      {/* <pre>{JSON.stringify({ relation }, null, 2)}</pre> */}
    </RelationContext.Provider>
  );
}

export default CreateRelations;
