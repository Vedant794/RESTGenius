import {useState} from 'react'

const useLoader=(initialColor:string="#ffffff",initialLoading:boolean=true)=>{
    const [loading,setLoading]=useState(initialLoading);
    const [color,setColor]=useState(initialColor);

    const toggleLoading=()=>setLoading(!loading)
    const changeColor=(newColor:string)=>setColor(newColor)

    return {
        loading,color,toggleLoading,changeColor
    }
}

export default useLoader