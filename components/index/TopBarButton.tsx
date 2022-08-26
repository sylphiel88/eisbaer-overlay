export default function TopBarButton(props:{
    index:number,
    active?:boolean,
    setCurrView:Function,
    name:string
}){
    return props.active ? (
        <button className={props.name==="Spotify" ? "eisbaer-overlay-button button-active" : "eisbaer-overlay-button-2 button-active-2"}>{props.name}</button>
      ) : (
        <button className={props.name==="Spotify" ? "eisbaer-overlay-button" : "eisbaer-overlay-button-2"} onClick={(e:React.MouseEvent<HTMLButtonElement>)=>props.setCurrView(props.index)}>{props.name}</button>
      );
}