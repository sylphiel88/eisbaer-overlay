import { AiOutlineYoutube } from "react-icons/ai";
import { FiMinusSquare } from "react-icons/fi";
export default function YouTubeInfo(props: {
  itemInfos: any | string;
  setCurrentVideo: Function;
  removeVideo: Function;
  currView: number;
  setCurrView: Function;
}) {
  return typeof props.itemInfos === "string" ? (
    <li></li>
  ) : (
    <div>
      <div>{props.itemInfos.items[0].snippet.title}</div>
      <span
        onClick={(event: React.MouseEvent<HTMLSpanElement>) => {
          props.removeVideo(props.itemInfos.items[0].id);
        }}
      >
        <FiMinusSquare
          style={{ float: "right", padding: "3px", marginLeft: "0.5em" }}
          size={30}
        />
      </span>
      <span
        onClick={(event: React.MouseEvent<HTMLSpanElement>) => {
          props.setCurrView(2);
          props.setCurrentVideo(props.itemInfos.items[0].id);
        }}
      >
        <AiOutlineYoutube style={{ float: "right" }} size={30} />
      </span>
    </div>
  );
}
