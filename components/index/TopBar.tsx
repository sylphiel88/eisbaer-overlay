import TopBarButton from "./TopBarButton";

export default function TopBar(props: {
  setCurrView: Function;
  currView: number;
  views: string[];
}) {
  function makeTab(v: string, i: number): JSX.Element {
    return props.currView === i ? (
      <TopBarButton
        active
        index={i}
        name={props.views[i]}
        setCurrView={props.setCurrView}
      />
    ) : (
      <TopBarButton
        index={i}
        name={props.views[i]}
        setCurrView={props.setCurrView}
      />
    );
  }

  return (
    <>
      <div className="topbar">{props.views.map((v, i) => makeTab(v, i))}</div>
    </>
  );
}
