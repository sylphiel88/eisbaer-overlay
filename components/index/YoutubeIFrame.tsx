export default function YoutubeIFrame(props:{
    youtubeLink:string
}){
    return (
        <>
            <iframe className="youtube-frame" src={`https://www.youtube.com/embed/${props.youtubeLink}?autoplay=1`} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
        </>
    )
}