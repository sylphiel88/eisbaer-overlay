import React, { useEffect, useState } from "react"
import ReactPlayer from 'react-player';

const IntroYoung = () => {

    const [playing, setPlaying] = useState<boolean>(false)

    useEffect(() => {
        if (!playing) {
            let video = document.getElementById('video') as HTMLVideoElement
            if (video !== undefined && video !== null) {
                video.play()
                setPlaying(true)
            }
        }
    })

    return (
        <>
            <ReactPlayer controls url={`http://localhost:3000/intro_modern.mp4`} width={`-webkit-fill-available`} height={`-webkit-fill-available`}/>
            <div className="hide-logo"/>
        </>
    )
}

export default IntroYoung