import { useEffect, useState } from "react";
import { IoMdAdd, IoMdTrash } from "react-icons/io";
import useTheme from "./context/ModeContext";
import Navbar from "./Navbar";
import useSchema, { schemaContext } from "./context/schemaContext";
import useProjectName from "./context/projectNameContext";
import axios from "axios";
import useSchemaIndex, { SchemaIndexContext } from "./context/SchemaIndex";
import GetStarted from "./GetStarted";
import deleteIcon from "../assets/bin.gif";
import { schemaFunc } from "./operations/schemaFunction";

export default function CustomSchema() {
  interface schemaType {
    schema_name: "";
    schema_dbname: "";
    attributes: [];
    routes: [];
    relation: [];
  }

  interface schemaFromBack {
    schema_name: "";
    schema_dbname: "";
    attributes: [];
    routes: [];
    _id: "";
    relation: [];
  }

  const { schemas, setSchemas } = useSchema();
  const { mode } = useTheme();
  const { ind, setIndex } = useSchemaIndex();
  const [backSchema, setBackSchema] = useState<schemaType[]>([]);
  const { projectName } = useProjectName();

  type Attribute = {
    var_name: string;
    db_type: string;
    var_dbname: string;
    isRequired: boolean;
    isSet: boolean;
    isList: boolean;
    isObject: boolean;
    isDate: boolean;
    isUUID: boolean;
    isIndexed: boolean;
    attributes: Attribute[]; // For nested attributes
  };

  useEffect(() => {
    const savedSchemas = sessionStorage.getItem("schemas");
    if (savedSchemas) {
      setSchemas(JSON.parse(savedSchemas));
    }
  }, []);

  useEffect(() => {
    sessionStorage.setItem("schemas", JSON.stringify(schemas));
  }, [schemas]);

  const handleRemoveSchemaToBackend = async (index: number) => {
    try {
      const schemaName = backSchema[index]?.schema_name;
      if (!schemaName) {
        console.error("Schema name not found!");
        return;
      }

      // Delete schema from backend
      await axios.delete(
        `http://localhost:3000/backend/deleteSchema/${projectName}/${schemaName}`
      );

      // Remove schema from state (immutable update)
      const updatedBackSchema = [...backSchema];
      updatedBackSchema.splice(index, 1);
      setBackSchema(updatedBackSchema);
    } catch (error) {
      console.error("Error deleting schema:", error);
    }
  };

  const handleSchemaNameChange = (index: number, value: string) => {
    const updatedSchemas = [...schemas];
    updatedSchemas[index].schema_name = value;
    setSchemas(updatedSchemas);
    setIndex(index);
  };

  const handleDBNameChange = (index: number, value: string) => {
    const updatedSchemas = [...schemas];
    updatedSchemas[index].schema_dbname = value;
    setSchemas(updatedSchemas);
  };

  const handleAddAttribute = (index: number) => {
    const updatedSchemas = [...schemas];
    updatedSchemas[index].attributes.push({
      var_name: "",
      db_type: "String",
      var_dbname: "",
      isRequired: false,
      isSet: false,
      isList: false,
      isObject: false,
      isDate: false,
      isUUID: false,
      isIndexed: false,
      attributes: [],
    });
    setSchemas(updatedSchemas);
  };

  const handleAttributeChange = (
    schemaIndex: number,
    attrIndex: number,
    field: keyof Attribute,
    value: any
  ) => {
    const updatedSchemas = [...schemas];
    updatedSchemas[schemaIndex].attributes[attrIndex][field] = value;
    setSchemas(updatedSchemas);
  };

  const handleAddNestedAttribute = (schemaIndex: number, attrIndex: number) => {
    const updatedSchemas = [...schemas];
    updatedSchemas[schemaIndex].attributes[attrIndex].attributes.push({
      var_name: "",
      db_type: "String",
      var_dbname: "",
      isRequired: false,
      isSet: false,
      isList: false,
      isObject: false,
      isDate: false,
      isUUID: false,
      isIndexed: false,
      attributes: [],
    });
    setSchemas(updatedSchemas);
  };

  const handleRemoveAttribute = (schemaIndex: number, attrIndex: number) => {
    const updatedSchemas = [...schemas];
    updatedSchemas[schemaIndex].attributes = updatedSchemas[
      schemaIndex
    ].attributes.filter(
      (attribute: Attribute, idx: number) => idx !== attrIndex
    );
    setSchemas(updatedSchemas);
  };
  const handleRemoveNestedAttribute = (
    schemaIndex: number,
    attrIndex: number,
    nestedIndex: number
  ) => {
    const updatedSchemas = [...schemas];
    updatedSchemas[schemaIndex].attributes[attrIndex].attributes =
      updatedSchemas[schemaIndex].attributes[attrIndex].attributes.filter(
        (nestedAttribute: Attribute, idx: number) => idx !== nestedIndex
      );
    setSchemas(updatedSchemas);
  };

  const handleNestedAttributeChange = (
    schemaIndex: number,
    attrIndex: number,
    nestedIndex: number,
    field: keyof Attribute,
    value: any
  ) => {
    const updatedSchemas = [...schemas];
    updatedSchemas[schemaIndex].attributes[attrIndex].attributes[nestedIndex][
      field
    ] = value;
    setSchemas(updatedSchemas);
  };

  type SchemaWithoutId = Omit<schemaType, "_id">;
  const handleBackSchemas = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/backend/getProjectData/${projectName}`
      );
      // console.log(response.data.projectData.schemas);
      const fetchedData: SchemaWithoutId[] =
        response.data.projectData.schemas.map((schema: schemaFromBack) => {
          const { _id, ...rest } = schema;
          return rest;
        });
      setBackSchema(fetchedData);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (e: React.FormEvent, index: number) => {
    e.preventDefault();

    const schemaData = schemas;
    // Save the schema to localStorage
    localStorage.setItem("schemaData", JSON.stringify(schemaData));
    setIndex(index);
    await handleAddSchemaToBackend(index);
    setSchemas([]);
    handleBackSchemas();
  };
  // console.log(backSchema);

  const handleAddSchemaToBackend = async (index: number) => {
    try {
      // console.log(schemas[index])
      const response = await axios.post(
        `http://localhost:3000/backend/addSchemas/${projectName}`,
        {
          schemas: [schemas[index]],
        }
      );
      // console.log(response.data);
    } catch (error) {
      console.error("Error adding schema to backend:", error);
    }
  };

  const handleSetAlert = () => {
    alert("Your Schema has been added you can create more or move further");
  };

  useEffect(() => {
    handleBackSchemas();
  }, [projectName]);

  // console.log(schemas)
  // console.log(projectName)

  return (
    <div>
      <schemaContext.Provider value={{ schemas, setSchemas }}>
        <SchemaIndexContext.Provider value={{ ind, setIndex }}>
          <Navbar />
          <GetStarted />
          <div className="container mx-auto my-[13vh] p-4 -mt-[95vh] ml-56">
            <div className=" ml-20">
              <h1 className="text-2xl font-bold mb-4">
                Create Your Custom Schema
              </h1>

              <button
                type="button"
                onClick={() => schemaFunc.handleAddSchema(schemas, setSchemas)}
                className={`h-auto w-auto text-lg font-medium shadow-lg  ${mode ? "shadow-slate-500" : "shadow-black"} bg-blue-500 text-white px-4 py-2 mb-4 rounded-md`}
              >
                Add New Schema
              </button>
              {backSchema?.length > 0 && (
                <div className="outputDesc w-full h-auto px-2 py-4 shadow-lg">
                  {backSchema.map((schema, index) => (
                    <div
                      key={index}
                      className="font-popins flex justify-between items-center font-medium text-xl px-4"
                    >
                      <span>
                        {index + 1}. {schema.schema_name ?? "No Data"}
                      </span>
                      <img
                        src={deleteIcon}
                        alt="Delete"
                        width={30}
                        height={30}
                        className="cursor-pointer"
                        onClick={() => handleRemoveSchemaToBackend(index)}
                      />
                    </div>
                  ))}
                </div>
              )}

              {schemas.map((schema, schemaIndex) => (
                <div
                  key={schemaIndex}
                  className={`schema-section w-[60vw] mt-9 ml-36 shadow-custom-heavy ${mode ? "bg-gray-100" : "bg-[#202725] shadow-black"} p-4 mb-6 rounded-md`}
                >
                  <form
                    action=""
                    className="schemaForm"
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSubmit(e, schemaIndex);
                      handleSetAlert();
                    }}
                  >
                    <input
                      type="text"
                      placeholder="Schema Name"
                      value={schema.schema_name}
                      onChange={(e) =>
                        handleSchemaNameChange(schemaIndex, e.target.value)
                      }
                      className={`w-full px-4 py-2 mb-4 rounded-md shadow-lg ${mode ? "bg-white" : "bg-[#282929] shadow-black"} focus:outline-none`}
                    />
                    <input
                      type="text"
                      placeholder="Database Name"
                      value={schema.schema_dbname}
                      onChange={(e) =>
                        handleDBNameChange(schemaIndex, e.target.value)
                      }
                      className={`w-full px-4 py-2 mb-4 rounded-md shadow-lg ${mode ? "bg-white" : "bg-[#282929] shadow-black"} focus:outline-none`}
                    />

                    <button
                      type="button"
                      onClick={() => handleAddAttribute(schemaIndex)}
                      className="h-auto w-auto flex justify-evenly items-center text-lg font-medium shadow-xl bg-green-500 text-white px-4 py-2 mb-4 mt-2 rounded-md"
                    >
                      Add Field <IoMdAdd />
                    </button>

                    {schema.attributes.map(
                      (attribute: Attribute, attrIndex: number) => (
                        <div
                          key={attrIndex}
                          className={`attribute-section ${mode ? "bg-gray-100" : "bg-[#202725] shadow-black"} p-4 mb-4 rounded-md shadow-xl`}
                        >
                          <input
                            type="text"
                            placeholder="Variable Name"
                            value={attribute.var_name}
                            onChange={(e) =>
                              handleAttributeChange(
                                schemaIndex,
                                attrIndex,
                                "var_name",
                                e.target.value
                              )
                            }
                            className={`w-full px-4 py-2 mb-4 rounded-md shadow-lg ${mode ? "bg-white" : "bg-[#282929] shadow-black"} focus:outline-none`}
                          />

                          <select
                            value={attribute.db_type}
                            onChange={(e) => {
                              const selectedType = e.target.value;
                              handleAttributeChange(
                                schemaIndex,
                                attrIndex,
                                "db_type",
                                selectedType
                              );

                              if (selectedType === "Object") {
                                handleAttributeChange(
                                  schemaIndex,
                                  attrIndex,
                                  "isObject",
                                  true
                                );
                              } else {
                                handleAttributeChange(
                                  schemaIndex,
                                  attrIndex,
                                  "isObject",
                                  false
                                );
                              }
                            }}
                            className={`w-full px-4 py-2 mb-4 rounded-md shadow-lg ${mode ? "bg-white" : "bg-[#282929] shadow-black"} focus:outline-none`}
                          >
                            <option value={""}>Select Type</option>
                            <option value="String">String</option>
                            <option value="Number">Number</option>
                            <option value="Boolean">Boolean</option>
                            <option value="Array">Array</option>
                            <option value="Object">Object</option>
                          </select>

                          <input
                            type="text"
                            placeholder="Variable Database Name"
                            value={attribute.var_dbname}
                            onChange={(e) =>
                              handleAttributeChange(
                                schemaIndex,
                                attrIndex,
                                "var_dbname",
                                e.target.value
                              )
                            }
                            className={`w-full px-4 py-2 mb-4 rounded-md shadow-lg ${mode ? "bg-white" : "bg-[#282929] shadow-black"} focus:outline-none`}
                          />

                          <div className="flex justify-evenly items-center mb-2">
                            <label className="flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={attribute.isRequired}
                                onChange={(e) =>
                                  handleAttributeChange(
                                    schemaIndex,
                                    attrIndex,
                                    "isRequired",
                                    e.target.checked
                                  )
                                }
                              />
                              <span className="ml-2">Required</span>
                            </label>
                            <label className="flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={attribute.isSet}
                                onChange={(e) =>
                                  handleAttributeChange(
                                    schemaIndex,
                                    attrIndex,
                                    "isSet",
                                    e.target.checked
                                  )
                                }
                              />
                              <span className="ml-2">Set</span>
                            </label>
                            <label className="flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={attribute.isList}
                                onChange={(e) =>
                                  handleAttributeChange(
                                    schemaIndex,
                                    attrIndex,
                                    "isList",
                                    e.target.checked
                                  )
                                }
                              />
                              <span className="ml-2">List</span>
                            </label>
                            <label className="flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={attribute.isObject}
                                onChange={(e) =>
                                  handleAttributeChange(
                                    schemaIndex,
                                    attrIndex,
                                    "isObject",
                                    e.target.checked
                                  )
                                }
                              />
                              <span className="ml-2">Object</span>
                            </label>
                            <label className="flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={attribute.isDate}
                                onChange={(e) =>
                                  handleAttributeChange(
                                    schemaIndex,
                                    attrIndex,
                                    "isDate",
                                    e.target.checked
                                  )
                                }
                              />
                              <span className="ml-2">Date</span>
                            </label>
                            <label className="flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={attribute.isUUID}
                                onChange={(e) =>
                                  handleAttributeChange(
                                    schemaIndex,
                                    attrIndex,
                                    "isUUID",
                                    e.target.checked
                                  )
                                }
                              />
                              <span className="ml-2">UUID</span>
                            </label>
                            <label className="flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={attribute.isIndexed}
                                onChange={(e) =>
                                  handleAttributeChange(
                                    schemaIndex,
                                    attrIndex,
                                    "isIndexed",
                                    e.target.checked
                                  )
                                }
                              />
                              <span className="ml-2">Indexed</span>
                            </label>
                          </div>

                          {attribute.db_type === "Object" && (
                            <div className="nested-section">
                              <h4 className="font-bold mb-2">
                                Nested Attributes
                              </h4>
                              <button
                                type="button"
                                onClick={() =>
                                  handleAddNestedAttribute(
                                    schemaIndex,
                                    attrIndex
                                  )
                                }
                                className="h-auto w-auto flex justify-evenly items-center text-lg font-medium shadow-xl bg-green-500 text-white px-4 py-2 rounded-md mb-2"
                              >
                                Add Nested Field <IoMdAdd />
                              </button>

                              {attribute.attributes.map(
                                (nestedAttr, nestedIndex: number) => (
                                  <div
                                    key={nestedIndex}
                                    className={`nested-attribute shadow-xl ${mode ? "bg-gray-200" : "bg-[#202725] shadow-black"} p-2 mb-2 mt-4 rounded-md`}
                                  >
                                    <input
                                      type="text"
                                      placeholder="Variable Name"
                                      value={nestedAttr.var_name}
                                      onChange={(e) =>
                                        handleNestedAttributeChange(
                                          schemaIndex,
                                          attrIndex,
                                          nestedIndex,
                                          "var_name",
                                          e.target.value
                                        )
                                      }
                                      className={`w-full px-4 py-2 mb-4 rounded-md shadow-lg ${mode ? "bg-white" : "bg-[#282929] shadow-black"} focus:outline-none`}
                                    />
                                    <select
                                      value={nestedAttr.db_type}
                                      onChange={(e) => {
                                        const selectedType = e.target.value;
                                        handleNestedAttributeChange(
                                          schemaIndex,
                                          attrIndex,
                                          nestedIndex,
                                          "db_type",
                                          e.target.value
                                        );
                                        if (selectedType === "Object") {
                                          handleNestedAttributeChange(
                                            schemaIndex,
                                            attrIndex,
                                            nestedIndex,
                                            "isObject",
                                            true
                                          );
                                        } else {
                                          handleNestedAttributeChange(
                                            schemaIndex,
                                            attrIndex,
                                            nestedIndex,
                                            "isObject",
                                            false
                                          );
                                        }
                                      }}
                                      className={`w-full px-4 py-2 mb-4 rounded-md shadow-lg ${mode ? "bg-white" : "bg-[#282929] shadow-black"} focus:outline-none`}
                                    >
                                      <option value="String">String</option>
                                      <option value="Number">Number</option>
                                      <option value="Boolean">Boolean</option>
                                      <option value="Array">Array</option>
                                      <option value="Object">Object</option>
                                    </select>
                                    <input
                                      type="text"
                                      placeholder="Variable Dataset Name"
                                      value={nestedAttr.var_dbname}
                                      onChange={(e) =>
                                        handleNestedAttributeChange(
                                          schemaIndex,
                                          attrIndex,
                                          nestedIndex,
                                          "var_dbname",
                                          e.target.value
                                        )
                                      }
                                      className={`w-full px-4 py-2 mb-4 rounded-md shadow-lg ${mode ? "bg-white" : "bg-[#282929] shadow-black"} focus:outline-none`}
                                    />

                                    <div className="flex justify-evenly items-center mb-2">
                                      <label className="flex items-center cursor-pointer">
                                        <input
                                          type="checkbox"
                                          checked={nestedAttr.isRequired}
                                          onChange={(e) =>
                                            handleNestedAttributeChange(
                                              schemaIndex,
                                              attrIndex,
                                              nestedIndex,
                                              "isRequired",
                                              e.target.checked
                                            )
                                          }
                                        />
                                        <span className="ml-2">Required</span>
                                      </label>
                                      <label className="flex items-center cursor-pointer">
                                        <input
                                          type="checkbox"
                                          checked={nestedAttr.isSet}
                                          onChange={(e) =>
                                            handleNestedAttributeChange(
                                              schemaIndex,
                                              attrIndex,
                                              nestedIndex,
                                              "isSet",
                                              e.target.checked
                                            )
                                          }
                                        />
                                        <span className="ml-2">Set</span>
                                      </label>
                                      <label className="flex items-center cursor-pointer">
                                        <input
                                          type="checkbox"
                                          checked={nestedAttr.isList}
                                          onChange={(e) =>
                                            handleNestedAttributeChange(
                                              schemaIndex,
                                              attrIndex,
                                              nestedIndex,
                                              "isList",
                                              e.target.checked
                                            )
                                          }
                                        />
                                        <span className="ml-2">List</span>
                                      </label>
                                      <label className="flex items-center cursor-pointer">
                                        <input
                                          type="checkbox"
                                          checked={nestedAttr.isObject}
                                          onChange={(e) =>
                                            handleNestedAttributeChange(
                                              schemaIndex,
                                              attrIndex,
                                              nestedIndex,
                                              "isObject",
                                              e.target.checked
                                            )
                                          }
                                        />
                                        <span className="ml-2">Object</span>
                                      </label>
                                      <label className="flex items-center cursor-pointer">
                                        <input
                                          type="checkbox"
                                          checked={nestedAttr.isDate}
                                          onChange={(e) =>
                                            handleNestedAttributeChange(
                                              schemaIndex,
                                              attrIndex,
                                              nestedIndex,
                                              "isDate",
                                              e.target.checked
                                            )
                                          }
                                        />
                                        <span className="ml-2">Date</span>
                                      </label>
                                      <label className="flex items-center cursor-pointer">
                                        <input
                                          type="checkbox"
                                          checked={nestedAttr.isUUID}
                                          onChange={(e) =>
                                            handleNestedAttributeChange(
                                              schemaIndex,
                                              attrIndex,
                                              nestedIndex,
                                              "isUUID",
                                              e.target.checked
                                            )
                                          }
                                        />
                                        <span className="ml-2">UUID</span>
                                      </label>
                                      <label className="flex items-center cursor-pointer">
                                        <input
                                          type="checkbox"
                                          checked={nestedAttr.isIndexed}
                                          onChange={(e) =>
                                            handleNestedAttributeChange(
                                              schemaIndex,
                                              attrIndex,
                                              nestedIndex,
                                              "isIndexed",
                                              e.target.checked
                                            )
                                          }
                                        />
                                        <span className="ml-2">Indexed</span>
                                      </label>
                                    </div>

                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleRemoveNestedAttribute(
                                          schemaIndex,
                                          attrIndex,
                                          nestedIndex
                                        )
                                      }
                                      className="h-auto w-auto flex justify-evenly items-center text-lg font-medium bg-red-500 text-white px-2 py-1 rounded-md"
                                    >
                                      Delete Nested Field <IoMdTrash />
                                    </button>
                                  </div>
                                )
                              )}
                            </div>
                          )}

                          <button
                            type="button"
                            onClick={() =>
                              handleRemoveAttribute(schemaIndex, attrIndex)
                            }
                            className="h-auto w-auto flex justify-evenly items-center mt-4 text-lg font-medium bg-red-500 text-white px-2 py-1 rounded-md"
                          >
                            Delete Field <IoMdTrash />
                          </button>
                        </div>
                      )
                    )}
                    <div className="routesDel flex justify-between items-center">
                      <button
                        type="button"
                        onClick={() => {
                          schemaFunc.handleRemoveSchema(
                            schemas,
                            setSchemas,
                            schemaIndex
                          );
                        }}
                        className="h-auto w-auto text-lg font-medium shadow-xl bg-red-600 text-white px-4 py-2 rounded-md mt-4"
                      >
                        Remove Schema
                      </button>

                      <button
                        type="submit"
                        className={`h-auto w-auto px-3 py-2 flex items-center shadow-lg ${mode ? "shadow-gray-600" : "shadow-black"} rounded-xl mb-4 bg-green-500 text-white font-bold text-xl transition duration-300 transform hover:scale-110`}
                      >
                        Done
                      </button>
                    </div>
                  </form>
                </div>
              ))}
            </div>
          </div>
        </SchemaIndexContext.Provider>
      </schemaContext.Provider>
    </div>
  );
}
