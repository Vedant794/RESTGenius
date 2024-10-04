import React, { useEffect, useState } from 'react';
import Create from '../assets/feather-pen.gif';
import read from '../assets/read.gif';
import read2 from '../assets/read2.gif';
import updateImg from '../assets/update.gif';
import deleteImg1 from '../assets/delete.gif';
import deleteImg2 from '../assets/trash-bin.gif';

interface SelectControllerProps {
  onSelectionChange?: (selection: string[]) => void;
}

export const SelectController: React.FC<SelectControllerProps> = ({ onSelectionChange }) => {
  const [getAll, setGetAll] = useState(false);
  const [getById, setGetById] = useState(false);
  const [post, setPost] = useState(false);
  const [update, setUpdate] = useState(false);
  const [deleteAll, setDeleteAll] = useState(false);
  const [deleteById, setDeleteById] = useState(false);

  const [userSelection, setUserSelection] = useState<string[]>([]);
  const [alertMessage, setAlertMessage] = useState<string | null>(null); // For the alert popup
  const [showAlert, setShowAlert] = useState(false); // Control the visibility of the alert

  const [isAllSelected, setIsAllSelected] = useState(false); // Track select all state

  interface Control {
    name: string;
    functionName: string;
    description: string;
    image: string;
    feature: boolean;
    setFeature: React.Dispatch<React.SetStateAction<boolean>>;
  }

  const controllerList: Control[] = [
    { name: 'Show All Information', functionName: 'getAllInfo()', description: 'This Function Gives All the Values For DataSet in the readable format', image: read, feature: getAll, setFeature: setGetAll },
    { name: 'Show Information by Reference', functionName: 'getInfoById()', description: 'This function gives you the values of dataset by referencing or by specific Id', image: read2, feature: getById, setFeature: setGetById },
    { name: 'Create Information', functionName: 'postInfo()', description: 'This function helps to create the values of dataset', image: Create, feature: post, setFeature: setPost },
    { name: 'Update Information', functionName: 'updateInfoById()', description: 'This Function gives you the access to update the value in the dataset', image: updateImg, feature: update, setFeature: setUpdate },
    { name: 'Delete Using Reference', functionName: 'deleteInfoById()', description: 'This function allows you to delete the particular entity with the help of their id', image: deleteImg1, feature: deleteById, setFeature: setDeleteById },
    { name: 'Delete All', functionName: 'deleteAllInfo()', description: 'This function allows you to delete entire dataset', image: deleteImg2, feature: deleteAll, setFeature: setDeleteAll },
  ];

  // Handle Checkbox Toggle
  const handleCheckBoxes = (setFeature: React.Dispatch<React.SetStateAction<boolean>>, feature: boolean, functionName: string) => {
    // Show alert only if the feature is being selected (checked)
    if (!feature) {
      setAlertMessage(`${functionName} selected`); // Set alert message when clicked
      setShowAlert(true); // Show alert popup
      setTimeout(() => {
        setShowAlert(false); // Hide alert after 3 seconds
      }, 3000);
    }
    setFeature(!feature); // Toggle the checkbox
  };

  // Effect to update the user selection based on toggled features
  useEffect(() => {
    const selectedController = controllerList
      .filter((controller) => controller.feature) // Only include selected features
      .map((controller) => controller.functionName);
      
    setUserSelection(selectedController);
    
    if (onSelectionChange) {
      onSelectionChange(selectedController);
    }

    // Update the "Select All" state based on whether all items are selected
    const allSelected = controllerList.every((controller) => controller.feature);
    setIsAllSelected(allSelected);
    
  }, [getAll, getById, post, update, deleteAll, deleteById]); // Track all features

  // Select/Deselect All Logic
  const handleSelectAll = () => {
    const newState = !isAllSelected; // Invert current state (select or deselect all)

    setGetAll(newState);
    setGetById(newState);
    setPost(newState);
    setUpdate(newState);
    setDeleteAll(newState);
    setDeleteById(newState);

    // Manually update the user selection when Select All is clicked
    const updatedSelection = newState
      ? controllerList.map((controller) => controller.functionName) // Select all
      : []; // Deselect all

    setUserSelection(updatedSelection);

    if (onSelectionChange) {
      onSelectionChange(updatedSelection);
    }
  };

  // console.log(userSelection)

  return (
    <>
      {/* Alert Notification */}
      {showAlert && (
        <div className="fixed right-5 bg-blue-500 text-white py-2 px-4 rounded-lg shadow-lg transition-opacity duration-300 ease-in-out z-50">
          {alertMessage}
        </div>
      )}

      <div className="card h-full w-full flex flex-wrap justify-center gap-6 p-4">
        {/* Card Info */}
        {controllerList.map((element: Control, index: number) => (
          <div
            className="cardInfo bg-white h-[18rem] w-[16rem] flex flex-col items-center justify-evenly mx-3 rounded-xl shadow-2xl transition duration-300 transform hover:scale-110 hover:shadow-lg hover:bg-gray-100 cursor-pointer"
            key={index}
          >
            <p className="description text-2xl font-serif font-semibold text-black text-center">{element.name}</p>
            <img src={element.image} alt={element.name} className="h-20 w-20 object-contain" />
            <p className="functions text-xl font-serif font-semibold text-gray-700 text-center">{element.functionName}</p>
            <p className="description text-md font-sans font-semibold text-gray-700 text-center">{element.description}</p>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={element.feature}
                onChange={() => handleCheckBoxes(element.setFeature, element.feature, element.functionName)}
                className="mr-2 cursor-pointer"
              />
              <span className="text-sm font-medium text-gray-600">Add Function</span>
            </label>
          </div>
        ))}
      </div>

      {/* Select All Button */}
      <div className="selectAll flex justify-center">
        <button
          onClick={handleSelectAll}
          className={`h-[3rem] w-[9rem] shadow-xl rounded-xl mt-8 ${isAllSelected ? 'bg-red-500' : 'bg-green-500'} text-white font-bold text-xl transition duration-300 transform hover:scale-110`}
        >
          {isAllSelected ? 'Deselect All' : 'Select All'}
        </button>
      </div>
    </>
  );
};
