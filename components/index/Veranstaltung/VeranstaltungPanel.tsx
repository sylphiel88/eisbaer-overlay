import eisbaerLogo from '../../../assets/images/eisbaerlogo.png'

interface iVeranstaltunPanel {
    event: any,
    className: string
}


const VeranstaltungPanel = ({ event, className }: iVeranstaltunPanel) => {
    
    const date = new Date(event.date)
    return (
        <div className={className}>
            <div className='eventTitle'>
                <img src={"http://localhost:3000/" + eisbaerLogo.src} />
                <div className='presents'>präsentiert:</div>
            </div>
            <div className='eventDetails'>
                <div className='date'>{date.toLocaleDateString('de-DE', {weekday:"long", day:"2-digit", month:"long", year:"numeric"})}</div>
                <div className='eventName'>{event.name}</div>
                {event.catchphrase!=="" && <div>{event.catchphrase}</div>}
                {event.DjName!=="" && <div>mit eurem DJ <span className='djname'>{event.DjName}</span></div>}
            </div>
        </div>
    )
}

export default VeranstaltungPanel