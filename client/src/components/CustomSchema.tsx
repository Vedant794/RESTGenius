import { useState } from "react";
import { IoMdAdd, IoMdTrash } from "react-icons/io";
import useTheme from "./context/ModeContext";


export default function CustomSchema() {
  const [schemas, setSchemas] = useState<any[]>([]);
  const {mode} = useTheme()

  type Attribute = {
    var_name: string;
    db_type: string;
    var_dbname:string,
    isRequired: boolean;
    isSet: boolean;
    isList: boolean;
    isObject:boolean,
    isDate:boolean,
    isUUID:boolean,
    isIndexed:boolean,
    objectAttributes: Attribute[];  // For nested attributes
  };

  const handleAddSchema = () => {
    setSchemas([
      ...schemas,
      {
        schemaName: "",
        varName: "",
        attributes: [],
      },
    ]);
  };

  const handleRemoveSchema = (index: number) => {
    setSchemas(schemas.filter((_, idx) => idx !== index));
  };

  const handleSchemaNameChange = (index: number, value: string) => {
    const updatedSchemas = [...schemas];
    updatedSchemas[index].schemaName = value;
    setSchemas(updatedSchemas);
  };

  const handleVarNameChange = (index: number, value: string) => {
    const updatedSchemas = [...schemas];
    updatedSchemas[index].varName = value;
    setSchemas(updatedSchemas);
  };

  const handleAddAttribute = (index: number) => {
    const updatedSchemas = [...schemas];
    updatedSchemas[index].attributes.push({
      var_name: "",
      db_type: "String",
      var_dbname:"",
      isRequired: false,
      isSet: false,
      isList: false,
      isObject:false,
      isDate:false,
      isUUID:false,
      isIndexed:false,
      objectAttributes: [],
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
    updatedSchemas[schemaIndex].attributes[attrIndex].objectAttributes.push({
      var_name: "",
      db_type: "String",
      var_dbname:"",
      isRequired: false,
      isSet: false,
      isList: false,
      isObject:false,
      isDate:false,
      isUUID:false,
      isIndexed:false,
      objectAttributes: [],
    });
    setSchemas(updatedSchemas);
  };

  const handleRemoveAttribute = (schemaIndex: number, attrIndex: number) => {
    const updatedSchemas = [...schemas];
    updatedSchemas[schemaIndex].attributes = updatedSchemas[schemaIndex].attributes.filter(
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
    updatedSchemas[schemaIndex].attributes[attrIndex].objectAttributes =
      updatedSchemas[schemaIndex].attributes[attrIndex].objectAttributes.filter(
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
    updatedSchemas[schemaIndex].attributes[attrIndex].objectAttributes[
      nestedIndex
    ][field] = value;
    setSchemas(updatedSchemas);
  };

  // console.log(schemas)

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create Your Custom Schema</h1>

      <button
        onClick={handleAddSchema}
        className={`h-auto w-auto text-lg font-medium shadow-lg  ${mode?"shadow-slate-500":"shadow-black"} bg-blue-500 text-white px-4 py-2 mb-4 rounded-md`}
      >
        Add New Schema
      </button>

      {schemas.map((schema, schemaIndex) => (
        <div
          key={schemaIndex}
          className={`schema-section shadow-custom-heavy ${mode?'bg-gray-100':'bg-[#202725] shadow-black'} p-4 mb-6 rounded-md`}
        >
          <input
            type="text"
            placeholder="Schema Name"
            value={schema.schemaName}
            onChange={(e) =>
              handleSchemaNameChange(schemaIndex, e.target.value)
            }
          className={`w-full px-4 py-2 mb-4 rounded-md shadow-lg ${mode?'bg-white':'bg-[#282929] shadow-black'} focus:outline-none`}
          />
          <input
            type="text"
            placeholder="Variable Name"
            value={schema.varName}
            onChange={(e) => handleVarNameChange(schemaIndex, e.target.value)}
            className={`w-full px-4 py-2 mb-4 rounded-md shadow-lg ${mode?'bg-white':'bg-[#282929] shadow-black'} focus:outline-none`}
          />

          <button
            onClick={() => handleAddAttribute(schemaIndex)}
            className="h-auto w-auto flex justify-evenly items-center text-lg font-medium shadow-xl bg-green-500 text-white px-4 py-2 mb-4 mt-2 rounded-md"
          >
            Add Field <IoMdAdd />
          </button>

          {schema.attributes.map((attribute: Attribute, attrIndex: number) => (
            <div
              key={attrIndex}
              className={`attribute-section ${mode?'bg-white':'bg-[#202725] shadow-black'} p-4 mb-4 rounded-md shadow-xl`}
            >
              <input
                type="text"
                placeholder="Variable Name"
                value={attribute.var_name}
                onChange={(e) =>
                  handleAttributeChange(schemaIndex, attrIndex, "var_name", e.target.value)
                }
                className={`w-full px-4 py-2 mb-4 rounded-md shadow-lg ${mode?'bg-white':'bg-[#282929] shadow-black'} focus:outline-none`}
              />

              <select
                value={attribute.db_type}
                onChange={(e) =>
                  handleAttributeChange(schemaIndex, attrIndex, "db_type", e.target.value)
                }
                className={`w-full px-4 py-2 mb-4 rounded-md shadow-lg ${mode?'bg-white':'bg-[#282929] shadow-black'} focus:outline-none`}
              >
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
                  handleAttributeChange(schemaIndex, attrIndex, "var_dbname", e.target.value)
                }
                className={`w-full px-4 py-2 mb-4 rounded-md shadow-lg ${mode?'bg-white':'bg-[#282929] shadow-black'} focus:outline-none`}
              />

              <div className="flex justify-evenly items-center mb-2">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={attribute.isRequired}
                    onChange={(e) =>
                      handleAttributeChange(schemaIndex, attrIndex, "isRequired", e.target.checked)
                    }
                  />
                  <span className="ml-2">Required</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={attribute.isSet}
                    onChange={(e) =>
                      handleAttributeChange(schemaIndex, attrIndex, "isSet", e.target.checked)
                    }
                  />
                  <span className="ml-2">Set</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={attribute.isList}
                    onChange={(e) =>
                      handleAttributeChange(schemaIndex, attrIndex, "isList", e.target.checked)
                    }
                  />
                  <span className="ml-2">List</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={attribute.isObject}
                    onChange={(e) =>
                      handleAttributeChange(schemaIndex, attrIndex, "isObject", e.target.checked)
                    }
                  />
                  <span className="ml-2">Object</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={attribute.isDate}
                    onChange={(e) =>
                      handleAttributeChange(schemaIndex, attrIndex, "isDate", e.target.checked)
                    }
                  />
                  <span className="ml-2">Date</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={attribute.isUUID}
                    onChange={(e) =>
                      handleAttributeChange(schemaIndex, attrIndex, "isUUID", e.target.checked)
                    }
                  />
                  <span className="ml-2">UUID</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={attribute.isIndexed}
                    onChange={(e) =>
                      handleAttributeChange(schemaIndex, attrIndex, "isIndexed", e.target.checked)
                    }
                  />
                  <span className="ml-2">Indexed</span>
                </label>
              </div>

              {attribute.db_type === "Object" && (
                <div className="nested-section">
                  <h4 className="font-bold mb-2">Nested Attributes</h4>
                  <button
                    onClick={() => handleAddNestedAttribute(schemaIndex, attrIndex)}
                    className="h-auto w-auto flex justify-evenly items-center text-lg font-medium shadow-xl bg-green-500 text-white px-4 py-2 rounded-md mb-2"
                  >
                    Add Nested Field <IoMdAdd />
                  </button>

                  {attribute.objectAttributes.map(
                    (nestedAttr, nestedIndex: number) => (
                      <div
                        key={nestedIndex}
                        className={`nested-attribute shadow-xl ${mode?'bg-gray-200':'bg-[#202725] shadow-black'} p-2 mb-2 mt-4 rounded-md`}
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
                          className={`w-full px-4 py-2 mb-4 rounded-md shadow-lg ${mode?'bg-white':'bg-[#282929] shadow-black'} focus:outline-none`}
                        />
                        <select
                          value={nestedAttr.db_type}
                          onChange={(e) =>
                            handleNestedAttributeChange(
                              schemaIndex,
                              attrIndex,
                              nestedIndex,
                              "db_type",
                              e.target.value
                            )
                          }
                          className={`w-full px-4 py-2 mb-4 rounded-md shadow-lg ${mode?'bg-white':'bg-[#282929] shadow-black'} focus:outline-none`}
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
                          className={`w-full px-4 py-2 mb-4 rounded-md shadow-lg ${mode?'bg-white':'bg-[#282929] shadow-black'} focus:outline-none`}
                        />


                        <div className="flex justify-evenly items-center mb-2">
                        <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={nestedAttr.isRequired}
                    onChange={(e) =>
                      handleNestedAttributeChange(schemaIndex, attrIndex, nestedIndex, "isRequired", e.target.checked)
                    }
                  />
                  <span className="ml-2">Required</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={nestedAttr.isSet}
                    onChange={(e) =>
                      handleNestedAttributeChange(schemaIndex, attrIndex, nestedIndex, "isSet", e.target.checked)
                    }
                  />
                  <span className="ml-2">Set</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={nestedAttr.isList}
                    onChange={(e) =>
                      handleNestedAttributeChange(schemaIndex, attrIndex, nestedIndex, "isList", e.target.checked)
                    }
                  />
                  <span className="ml-2">List</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={nestedAttr.isObject}
                    onChange={(e) =>
                      handleNestedAttributeChange(schemaIndex, attrIndex, nestedIndex, "isObject", e.target.checked)
                    }
                  />
                  <span className="ml-2">Object</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={nestedAttr.isDate}
                    onChange={(e) =>
                      handleNestedAttributeChange(schemaIndex, attrIndex, nestedIndex, "isDate", e.target.checked)
                    }
                  />
                  <span className="ml-2">Date</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={nestedAttr.isUUID}
                    onChange={(e) =>
                      handleNestedAttributeChange(schemaIndex, attrIndex, nestedIndex, "isUUID", e.target.checked)
                    }
                  />
                  <span className="ml-2">UUID</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={nestedAttr.isIndexed}
                    onChange={(e) =>
                      handleNestedAttributeChange(schemaIndex, attrIndex, nestedIndex, "isIndexed", e.target.checked)
                    }
                  />
                  <span className="ml-2">Indexed</span>
                </label>
                        </div>

                        <button
                          onClick={() =>
                            handleRemoveNestedAttribute(schemaIndex, attrIndex, nestedIndex)
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
                onClick={() => handleRemoveAttribute(schemaIndex, attrIndex)}
                className="h-auto w-auto flex justify-evenly items-center mt-4 text-lg font-medium bg-red-500 text-white px-2 py-1 rounded-md"
              >
                Delete Field <IoMdTrash />
              </button>
            </div>
          ))}

          <button
            onClick={() => handleRemoveSchema(schemaIndex)}
            className="h-auto w-auto text-lg font-medium shadow-xl bg-red-600 text-white px-4 py-2 rounded-md mt-4"
          >
            Remove Schema
          </button>
        </div>
      ))}
    </div>
  );
}

