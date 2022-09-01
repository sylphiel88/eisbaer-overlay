import React, { useEffect, useState } from "react";
import querystring from "query-string";
import axiosInstance from "../../models/axiosInstance";
import { AxiosPromise } from "axios";
import YouTubeInfo from "./YouTubeInfo";

export default function SideBar(props: {
  useSpotifyHandler: React.MouseEventHandler<HTMLButtonElement>;
  setCurrView: Function;
  currView: number;
  views: string[];
  addYoutubeLink: Function;
  youtubeLinks: string[];
  spotifyRunning: boolean;
  useSlotMachine: boolean;
  slotMachineSetter: Function;
  slotMachineYear: number;
  numberOfTurns: number;
  setNumberOfTurns: Function;
  setRefreshToken: Function;
  setCurrentlyPlaying: Function;
  removeVideo: Function;
  useVirtualDJ:boolean;
  setUseVirtualDj:Function;
}) {
  const SCOPE = "user-read-currently-playing";
  const REDIRECT_URI =
    "http://localhost:3000/api/spotify/authorizationCodeCallback";

  const [youtubeInfos, setYoutubeInfos] = useState<any[]>([]);

  function makeVideo(video: any) {
    return (
      <YouTubeInfo
        itemInfos={video !== undefined ? video : ""}
        removeVideo={props.removeVideo}
        setCurrentVideo={props.setCurrentlyPlaying}
        currView={props.currView}
        setCurrView={props.setCurrView}
      />
    );
  }

  useEffect(() => {
    async function getYoutubeInfo(video: string) {
      var result = await axiosInstance.get(
        `http://localhost:3000/api/youtube/getYouTubeInfo?id=${video}`
      );
      var data = result.data;
      return data;
    }
    var result:AxiosPromise[] = []
    props.youtubeLinks.forEach((yl)=>{
      result.push(getYoutubeInfo(yl))
    })
    Promise.all(result).then((res)=>{
      setYoutubeInfos(res)
    })
  }, [props.youtubeLinks]);

  return (
    <>
      <div className="sidebar-section-list">
        <div className="sidebar-section-list-item" data-name="Spotify">
          <button
            onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
              props.useSpotifyHandler(e)
            }
            className="eisbaer-overlay-button"
          >
            {props.spotifyRunning
              ? "Spotify Abruf beenden"
              : "Spotify Abruf starten"}
          </button>
          <button className="eisbaer-overlay-button">
            <a
              href={
                "https://accounts.spotify.com/authorize?" +
                querystring.stringify({
                  response_type: "code",
                  client_id: process.env.SPOTIFY_CLIENT_ID,
                  scope: SCOPE,
                  redirect_uri: REDIRECT_URI,
                  show_dialog: true,
                })
              }
              target="_blank"
              rel="noreferrer"
            >
              Refresh Token holen
            </a>
          </button>
          <input
            className="youtube-link"
            type={"password"}
            id="refresh_token"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              props.setRefreshToken(e.currentTarget.value);
            }}
          ></input>
          <label htmlFor="refreshToken">Hier Refresh Token eingeben.</label>
        </div>
        <div className="sidebar-section-list-item-2" data-name="Youtube">
          <button
            onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
              props.setCurrView(props.currView===2?0:2)
            }
            className="eisbaer-overlay-button-2"
          >
            {`Youtube ${props.currView==2?'ausblenden':'einblenden'}`}
          </button>
          <div className="youtube-flex-wrapper">
            <input className="youtube-link" type={"text"} id="youtube-link" />
            <button
              className="youtube-accept-button"
              onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                var input = document.getElementById(
                  "youtube-link"
                ) as HTMLInputElement;
                props.addYoutubeLink(
                  input.value.includes("?v=") ? input.value.split("=")[1] : ""
                );
                input.value="";
              }}
            >
              +
            </button>
          </div>
          <div className="youtube-link-video-list">
            {youtubeInfos.map((video) => makeVideo(video))}
          </div>
        </div>
        <div className="sidebar-section-list-item-2" data-name="Slotmachine">
          <button
            className="eisbaer-overlay-button-2"
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
              props.slotMachineSetter();
              {
                !props.useSlotMachine && props.setCurrView(1);
              }
            }}
          >{`Slotmaschine ${
            props.useSlotMachine ? "ausmachen" : "anmachen"
          }!`}</button>
          {props.useSlotMachine && (
            <>
              <p>{props.slotMachineYear}</p>
              <span>Anzahl Drehungen ~ 0.5s pro Drehung</span>
              <input
                className="youtube-link"
                type={"number"}
                min={1}
                max={120}
                value={props.numberOfTurns}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  props.setNumberOfTurns(e.currentTarget.value);
                }}
              />
              <br />
              <span>{`~ ${props.numberOfTurns / 2}s`}</span>
            </>
          )}
        </div>
        <div className="sidebar-section-list-item-2 vdj-sidebar-section" data-name="Virtual Dj">
          <input type={'checkbox'} defaultChecked={props.useVirtualDJ} onChange={(event:React.ChangeEvent<HTMLInputElement>)=>{
            props.setUseVirtualDj(!props.useVirtualDJ)}} id="virtual-dj-check" className="virtual-dj-check"/>
            Virtual DJ benutzen
        </div>
      </div>
    </>
  );
}
