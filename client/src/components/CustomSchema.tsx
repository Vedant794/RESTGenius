// import React from 'react'
import { useRef, useState } from "react";
import { IoMdAdd } from "react-icons/io"
import { IoMdTrash } from "react-icons/io";

export default function CustomSchema() {
    const [forms, setForms] = useState<number[]>([]); 
    const inputRef = useRef<HTMLInputElement | null>(null)

    type Attribute={
        name: string,
        type: string,
        dbVarName: string,
        isRequired: boolean,
        isUnique: boolean,
        isIndexed: boolean,
        objectAttributes: Attribute[];
    }
    
    interface schema{
        schemaName:string,
        varName:string,
        userSelection:Array<String>,
        attributes:Array<Attribute>
    }

    // Add new form on button click
    const handleAddForm = () => {
        setForms([...forms, forms.length + 1]);
    };

    // Remove form based on index
    const handleRemoveForm = (index: number) => {
        setForms(forms.filter((_, idx) => idx !== index));
    };

    const handleFocus=()=>{
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }

    const schemas:schema[]=[]
    return (
        <>
            <div className="schema">
                <div className="add-name flex justify-between">
                    <input type="text" placeholder="Enter Schema Name" className="h-auto w-auto px-6 py-3 outline-none bg-white rounded-xl shadow-xl"/>
                    <button
                        onClick={()=>{handleAddForm(); handleFocus();}}
                        className="add flex justify-evenly items-center h-auto w-auto px-4 py-2 bg-green-500 text-white rounded-xl font-sans font-semibold text-xl shadow-xl transition duration-300 transform hover:scale-110"
                    >
                        Add<IoMdAdd />
                    </button>
                </div>

                <div className="form-section">
                    {forms.map((form, index) => (
                        <div key={index} className="form-item flex justify-evenly items-center my-4 p-4 bg-slate-100 text-black rounded-md shadow-lg">
                            <input
                                ref={inputRef}
                                type="text"
                                placeholder="Enter Field Name"
                                className="input-field bg-white p-2 rounded-md text-black focus:outline-none"
                            />
                            <select className="input-field bg-white p-2 rounded-md text-black focus:outline-none">
                                <option value="String">String</option>
                                <option value="Number">Number</option>
                                <option value="Boolean">Boolean</option>
                                {/* Add more types as needed */}
                            </select>
                            <div className="flex items-center">
                                <span className="mr-2">Required</span>
                                <input type="checkbox" className="toggle-checkbox" />
                            </div>
                            <button className="bg-white p-2 rounded-md text-black">
                                Select more Option
                            </button>
                            <button
                                onClick={() => handleRemoveForm(index)}
                                className="delete-button text-red-500 p-2"
                            >
                                <IoMdTrash size={24} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
