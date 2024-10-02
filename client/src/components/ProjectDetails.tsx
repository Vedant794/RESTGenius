import React, { useState } from "react";

interface ComponentTheme {
  mode: boolean;
}

export default function ProjectDetails({ mode }: ComponentTheme) {
  const [selectOrm, setSelectOrm] = useState("");
  const [projectName, setProjectName] = useState("");
  const [mongoUri, setMongoUri] = useState("");
  const [port, setPort] = useState<number | undefined>(undefined);

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectOrm(event.target.value);
  };

  const handleProjectNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setProjectName(event.target.value);
  };

  const handleMongoUriChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMongoUri(event.target.value);
  };

  const handlePortChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPort(Number(event.target.value));
  };

  interface Details {
    projectName: string;
    selectOrm: string;
    mongoUri: string;
    port?: number;
  }

  const saveFormData = () => {
    const userInput: Details = {
      projectName,
      selectOrm,
      mongoUri,
      port
    };

    // Store the data in sessionStorage
    sessionStorage.setItem("formData", JSON.stringify(userInput));

    // For debugging, you can log it or do something else
    console.log("Form Data Saved:", userInput);
  };

  return (
    <div>
      <div className={`detailForm h-auto w-auto p-10 shadow-custom-heavy rounded-sm ${mode ? 'bg-white' : 'shadow-black'}`}>
        <form
          action=""
          className="projectForm flex flex-col justify-center"
          onSubmit={(e) => {
            e.preventDefault();
            saveFormData();
          }}
        >
          <div className="name flex flex-col justify-center">
            <label className="title text-lg font-sans font-medium" htmlFor="projectName">
              Project Name
            </label>
            <input
              type="text"
              name="projectName"
              id="name"
              value={projectName}
              onChange={handleProjectNameChange}
              className={`h-[2rem] w-[25rem] ${mode ? 'bg-slate-100 text-black' : 'bg-[#282929] text-white shadow-black'} p-5 focus:outline-none mt-3 shadow-xl`}
            />
          </div>
          <div className="uri flex flex-col justify-center mt-8">
            <label className="title text-lg font-sans font-medium" htmlFor="mongoUri">Monodb URL</label>
            <input
              type="text"
              name="mongoUri"
              id="uri"
              value={mongoUri}
              onChange={handleMongoUriChange}
              className={`h-[2rem] w-[25rem] ${mode ? 'bg-slate-100 text-black' : 'bg-[#282929] text-white shadow-black'} p-5 focus:outline-none mt-3 shadow-xl`}
            />
          </div>
          <div className="port flex flex-col justify-center mt-8">
            <label className="title text-lg font-sans font-medium" htmlFor="port">PORT (Not necessary)</label>
            <input
              type="number"
              name="port"
              placeholder="Ex.:8000"
              id="uri"
              value={port !== undefined ? port : ''}
              onChange={handlePortChange}
              className={`h-[2rem] w-[25rem] ${mode ? 'bg-slate-100 text-black' : 'bg-[#282929] text-white shadow-black'} p-5 focus:outline-none mt-3 shadow-xl`}
            />
          </div>
          <div className="selctOrm mt-8 flex flex-col">
            <label className="orm text-lg font-sans font-medium" htmlFor="selectOrm">Select Orm</label>
            <select
              name="selectOrm"
              id="orm"
              value={selectOrm}
              onChange={handleSelectChange}
              className={`h-auto w-[25rem] ${mode ? 'bg-slate-100 text-black' : 'bg-[#282929] text-white shadow-black'} p-3 focus:outline-none mt-3 shadow-xl cursor-pointer`}
            >
              <option value="" disabled>Select an ORM</option>
              <option value="NodeJs">NodeJs</option>
              <option value="Spring">Spring</option>
            </select>
          </div>
          <div className="btns">
            <button
              type="submit"
              className="h-[3rem] w-[7rem] shadow-lg rounded-xl mt-8 bg-green-500 text-white font-bold text-xl transition duration-300 transform hover:scale-110"
            >
              Next
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}