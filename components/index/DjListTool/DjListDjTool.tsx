import { useCallback, useEffect, useState } from "react"
import axiosInstance from "../../../models/axiosInstance"

export default function DjListDjTool(){

    const [djs, setDjs] = useState<any[]>()
    const [newDj, setNewDj] = useState<string>()

    const setNewDjCallback = useCallback((event:React.ChangeEvent<HTMLInputElement>)=>{setNewDj(event.currentTarget.value)},[])
    const createDjCallback = useCallback((event:React.MouseEvent<HTMLButtonElement>)=>{console.log(newDj); createDj(newDj)},[])

    useEffect(()=>{
        axiosInstance.get('http://localhost:5000/getDjs').then((res)=>{
            setDjs(res.data)
        })
    },[])

    const makeDj = (dj: any) => {
        return <div>{dj.name}</div>
    }

    const createDj = (name: string|undefined) => {
        if(name!==undefined){
            axiosInstance.post('http://localhost:5000/makeDj',{name:`${newDj}`}).then((res)=>{
                setDjs(res.data)
            })
        }
    }

    return (
        <>
            <div className="dj-list-dj-tool-section" data-name="Aktuelle Djs">{djs?.map((dj)=>makeDj(dj))}</div>
            <div className="dj-list-dj-tool-section" data-name="Dj erstellen">
                <input type={"text"} onChange={setNewDjCallback} className="youtube-link"/>
                <button onClick={createDjCallback} className="eisbaer-overlay-button-3">Erzeuge Dj</button>
            </div>
        </>
    )
}