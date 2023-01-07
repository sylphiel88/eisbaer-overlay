import { useEffect, useState } from "react"

interface iIntroJan {
    setPage: Function;
    setSong: Function;
    introSound: HTMLAudioElement
}

const IntroJan = ({setPage,setSong, introSound}:iIntroJan) => {

    const [classes, setClasses] = useState<string[]>(["intro intro-start", "top-curtain", "side-curtains","curtain-left","curtain-right"])


    const [introTexts, setIntroTexts] = useState<boolean[]>([false, false, false, false, false, false])
    const [curtainsOpen, setCurturtainsOpen] = useState<boolean>(false)

    useEffect(()=>{
        setTimeout(()=>{introSound.play()}, 2000)
        setTimeout(()=>{
            let tempClass = classes
            tempClass[0] = "intro animated"
            setClasses([...tempClass])
        }, 4000)
        setTimeout(()=>{
            let tempClass = classes
            tempClass[0] = "intro animated zoomed"
            setClasses([...tempClass])
        }, 19000)
        setTimeout(()=>{
            setCurturtainsOpen(true)
        },24000)
        setTimeout(()=>{
            let newIntroTexts = introTexts
            newIntroTexts[0] = true
            setIntroTexts([...newIntroTexts])
        },27550)
        setTimeout(()=>{
            let newIntroTexts = introTexts
            newIntroTexts[1] = true
            setIntroTexts([...newIntroTexts])
        }, 28000)
        setTimeout(()=>{
            let newIntroTexts = introTexts
            newIntroTexts[0] = false
            newIntroTexts[1] = false
            newIntroTexts[2] = true
            setIntroTexts([...newIntroTexts])
        },29800)
        setTimeout(()=>{
            let newIntroTexts = introTexts
            newIntroTexts[3] = true
            setIntroTexts([...newIntroTexts])
        }, 30250)
        setTimeout(()=>{
            let newIntroTexts = introTexts
            newIntroTexts[2] = false
            newIntroTexts[3] = false
            newIntroTexts[4] = true
            setIntroTexts([...newIntroTexts])
        },31850)
        setTimeout(()=>{
            let newIntroTexts = introTexts
            newIntroTexts[5] = true
            setIntroTexts([...newIntroTexts])
        }, 32300)
        setTimeout(()=>{
            setPage(0)
            setSong(true)
        }, 40000)
    },[])


    return (
        <div className={classes[0]}>
            <div className={classes[1]}></div>
            <div className={classes[2]}>
                <div className={classes[3]}>{new Array(10).fill("A").map(()=><div></div>)}</div>
                <div className={classes[4]}>{new Array(10).fill("A").map(()=><div></div>)}</div>
            </div>
            {curtainsOpen && <div className="content-intro">
                {introTexts[0] && <img src="http://localhost:3000/eisbaerlogo.png"/>}
                {introTexts[1] && <span>presents</span>}
                {introTexts[2] && <span className="mixed-metal">Mixed Metal</span>}
                {introTexts[3] && <span>mit DJ Jan</span>}
                {introTexts[4] && <span className="mixed-metal">Viel Spaß</span>}
                {introTexts[5] && <span>mit der Musik!</span>}
            </div>}
        </div>
    )
}

export default IntroJan