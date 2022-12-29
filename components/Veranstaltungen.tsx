import { useEffect, useState } from "react"
import axiosInstance from "../models/axiosInstance"

const Veranstaltungen = () => {

    const [nextEvents, getNextEvents] = useState<any[]>()

    useEffect(()=>{
        axiosInstance.get('http://localhost:5000/getNextEvents').then((res)=>{
            getNextEvents(res.data)
        })
    },[])

    useEffect(()=>{
        if(nextEvents) console.log(nextEvents)
    },[nextEvents])

    return <div className="veranstaltungen-wrapper">
        <div>Hallo</div>
    </div>
}

export default Veranstaltungen