import { CSSProperties, useEffect, useState } from "react"
import axiosInstance from "../../models/axiosInstance"
import SpotifyNowPlaying from "./NowPlaying";
import VeranstaltungPanel from "./Veranstaltung/VeranstaltungPanel"

interface iVeranstaltungen {
    token: string | undefined;
  useSpotify: boolean;
  year: number;
  refreshToken: string;
  useVirtualDj: boolean;
  virtualDJData: any;
  record: boolean;
}

const Veranstaltungen = ({token, useSpotify, year, refreshToken, useVirtualDj, virtualDJData, record}:iVeranstaltungen) => {

    const [nextEvents, getNextEvents] = useState<any[]>()

    const [rotation, setRotation] = useState<number>(300)

    const [currIndex, setCurrIndex] = useState<number>(0)

    const [realCurrIndex, setRealCurrIndex] = useState<number>(0)
    const [angle, setAngle] = useState<number>(60)

    useEffect(() => {
        axiosInstance.get('http://localhost:5000/getNextEvents').then((res) => {
            setAngle(360 / res.data.length)
            getNextEvents(res.data)
        })
        let interv = setInterval(() => {
            setCurrIndex(index => index + 1)
            setRotation(rot => rot - angle)
        }, 10000)
        return () => clearInterval(interv)
    }, [])

    useEffect(() => {
        setRealCurrIndex((currIndex + 1) % 6)
        if (currIndex!==undefined) console.log(currIndex)
    }, [currIndex])

    return <div className="veranstaltungen-wrapper">
        <div>
            <div className="circle-wrapper" style={{ "--rot": rotation } as CSSProperties}>
                {nextEvents && nextEvents.length > 0 && nextEvents.map((event: any, index: number) => {
                    return <div style={{ "--i": index, "--w": angle } as CSSProperties}><VeranstaltungPanel event={event} className={realCurrIndex === index? "current" : ""} /></div>
                })}
            </div>
        </div>
        <div className="miniNowPlaying">
        <SpotifyNowPlaying
            record={record}
            refreshToken={refreshToken}
            token={token}
            useSpotify={useSpotify}
            useVirtualDj={useVirtualDj}
            virtualDJData={virtualDJData}
            year={year}
        />
        </div>
    </div>
}

export default Veranstaltungen