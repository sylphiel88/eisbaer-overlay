import { useEffect, useState } from "react"
import axiosInstance from "../../models/axiosInstance"

export default function PlayListViewer(){

    type songInfo = {
        name:string,
        title:string
    }

    const [date, setDate] = useState<Date|null>()
    const [songInfos, setSongInfos] = useState<songInfo[]>()
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' } as const;
    const [lastDate, setLastDate] = useState<string>()

    useEffect(()=>{
        axiosInstance.get('http://localhost:5000/getLastDateWithEntrys').then((res)=>{
            console.log(res.data)
            setLastDate(res.data["lastDate"])
        })
    },[])

    useEffect(()=>{
        if(lastDate!==undefined){
            setDate(new Date(lastDate as string))
        }
    },[lastDate])

    useEffect(()=>{
        if(date!==undefined && date!==null){
            axiosInstance.post(`http://localhost:5000/getPlaylistAtDate`,{date: date}).then((res)=>{
                setSongInfos(res.data)
            })
        }
    },[date])    

    return (
        <>
            {lastDate!==undefined && <input type="date" className="playlist-date-picker" defaultValue={lastDate} onChange={(event:React.ChangeEvent<HTMLInputElement>)=>{setDate(event.currentTarget.valueAsDate)}}/>}
            {date!==undefined && songInfos!==undefined && songInfos.length > 0 ? <div className="view-playlist">
                <div className="playlist-wrapper">
                    <p className="playlist-header">{`Playlist vom ${date?.toLocaleDateString('de-DE',options)}`}</p>
                    {songInfos?.map((song, index)=><p>{`${index+1}. ${song.name} - ${song.title}`}</p>)}            
                </div>
            </div>:<div>{date===undefined && 'Kein korrektes Datum gewählt.'}{ ((songInfos!==undefined && !(songInfos.length > 0)) || songInfos===undefined || songInfos===null ) && 'An diesem Tag gab es keine Playlist.'}</div>}
        </>
    )
}