export default function TopBarButton(props:{
    index:number,
    active?:boolean,
    setCurrView:Function,
    name:string
}){
    return props.active ? (
        <button className="eisbaer-overlay-button button-active">{props.name}</button>
      ) : (
        <button className="eisbaer-overlay-button" onClick={(e:React.MouseEvent<HTMLButtonElement>)=>props.setCurrView(props.index)}>{props.name}</button>
      );
}