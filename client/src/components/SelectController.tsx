import React, { useEffect, useState } from 'react';
import Create from '../assets/feather-pen.gif';
import read from '../assets/read.gif';
import read2 from '../assets/read2.gif'
import updateImg from '../assets/update.gif';
import deleteImg1 from '../assets/delete.gif';
import deleteImg2 from '../assets/trash-bin.gif'

interface SelectControllerProps {
  onSelectionChange?: (selection: string[]) => void;
}

export const SelectController: React.FC<SelectControllerProps>=({onSelectionChange})=> {

    const [getAll,setGetAll]=useState(false)
    const [getById,setGetById]=useState(false)
    const [post,setPost]=useState(false)
    const [update,setUpdate]=useState(false)
    const [deleteAll,setDeleteAll]=useState(false)
    const [deleteById,setDeleteById]=useState(false)

    const [userSelection,setUserSelection]=useState<string[]>([])

    interface control{
        name:string,
        functionName:string,
        description:string,
        image:string,
        feature:boolean,
        setFeature:React.Dispatch<React.SetStateAction<boolean>>
    }

    const controllerList:control[]=[
        {name:"Show All Information",functionName:"getAllInfo()",description:"This Function Gives All the Values For DataSet in the readable format",image:read,feature:getAll,setFeature:setGetAll},
        {name:"Show Information by Reference",functionName:"getInfoById()",description:"This function gives you the values of dataset by referencing or by specific Id",image:read2,feature:getById,setFeature:setGetById},
        {name:"Create Information",functionName:"postInfo()",description:"This function helps to create the values of dataset",image:Create,feature:post,setFeature:setPost},
        {name:"Update Information",functionName:"updateInfoById()",description:"This Function gives you the access to update the value in the dataset",image:updateImg,feature:update,setFeature:setUpdate},
        {name:"Delete Using Reference",functionName:"deleteInfoById()",description:"This function allows you to delete the particular entity with the help of their id",image:deleteImg1,feature:deleteById,setFeature:setDeleteById},
        {name:"Delete All",functionName:"deleteAllInfo()",description:"This function allows you to delete entire dataset",image:deleteImg2,feature:deleteAll,setFeature:setDeleteAll}
    ]

    const handleCheckBoxes=(setFeature:React.Dispatch<React.SetStateAction<boolean>>,feature:boolean)=>{
      setFeature(!feature)
    }
    
    useEffect(()=>{
      const selectedController=controllerList.filter((controller)=>controller.feature).map((controller)=>controller.functionName)
      setUserSelection(selectedController)
      if(onSelectionChange){
        onSelectionChange(selectedController)
      }
    },[getAll,getById,post,update,deleteAll,deleteById])

    console.log(userSelection)

  return (
    <>
      <div className="card h-auto w-full flex flex-wrap justify-center gap-6 p-4">
  {/* Card Info */}
  {controllerList.map((element: control, index: number) => (
    <div
      className="cardInfo bg-white h-[20rem] w-[16rem] flex flex-col items-center justify-evenly mx-3 rounded-xl shadow-2xl transition duration-300 transform hover:scale-110 hover:shadow-lg hover:bg-gray-100 cursor-pointer"
      key={index}
    >
      <p className="description text-2xl font-serif font-semibold text-black text-center">
        {element.name}
      </p>
      <img src={element.image} alt={element.name} className="h-20 w-20 object-contain" />
      <p className='functions text-xl font-serif font-semibold text-gray-700 text-center'>
        {element.functionName}
      </p>
      <p className='description text-md font-sans font-semibold text-gray-700 text-center'>{element.description}</p>
      <label className="flex items-center">
        <input type="checkbox" checked={element.feature} onChange={() => handleCheckBoxes(element.setFeature, element.feature)} className="mr-2 cursor-pointer"/>
        <span className="text-sm font-medium text-gray-600">Add Function</span>
      </label>
    </div>
  ))}
</div>

    </>
  )
}
