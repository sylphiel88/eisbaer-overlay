import React, { useEffect, useState } from "react";
import querystring from "query-string";
import axiosInstance from "../../models/axiosInstance";
import { AxiosPromise } from "axios";
import YouTubeInfo from "./YouTubeInfo";
import SideBarSection from "./SideBarSection";
import TopBarButton from "./TopBarButton";
import { BsCheck, BsPlus } from "react-icons/bs";
import { FiMinus } from "react-icons/fi";

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
  useVirtualDJ: boolean;
  setUseVirtualDj: Function;
  clientSecret: string;
  clientId: string;
  refreshToken: string;
  yearSetter: Function;
  alreadyTakenYears: number[];
  setAlreadyTakenYears: Function;
  remAlreadyTakenYears:Function;
  reloadWindow:Function;
}) {
  const SCOPE = "user-read-currently-playing";
  const REDIRECT_URI =
    "http://localhost:3000/api/spotify/authorizationCodeCallback";

  const [youtubeInfos, setYoutubeInfos] = useState<any[]>([]);
  const [year, setYear] = useState<number>(1000);

  useEffect(() => {
    setYear(props.slotMachineYear);
  }, [props.slotMachineYear]);

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
    var result: AxiosPromise[] = [];
    props.youtubeLinks.forEach((yl) => {
      result.push(getYoutubeInfo(yl));
    });
    Promise.all(result).then((res) => {
      setYoutubeInfos(res);
    });
  }, [props.youtubeLinks]);

  function makeTab(v: string, i: number): JSX.Element {
    return (
      <TopBarButton
        active={props.currView === i}
        index={i}
        name={props.views[i]}
        setCurrView={props.setCurrView}
      />
    );
  }

  return (
    <>
      <div className="sidebar-section-list">
        <SideBarSection
          sectionClass="-2 bildschirme"
          sectionTitle="Bildschirm auswählen"
          defaultOpen
        >
          {props.views.map((view, index) => makeTab(view, index))}
        </SideBarSection>
        <SideBarSection sectionClass=" spotify-section" sectionTitle="Spotify">
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
                  client_id: props.clientId,
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
            defaultValue={props.refreshToken}
          ></input>
          <label htmlFor="refreshToken">Hier Refresh Token eingeben.</label>
        </SideBarSection>
        <SideBarSection sectionClass="-2" sectionTitle="Youtube">
          <button
            onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
              props.setCurrView(props.currView === 2 ? 0 : 2)
            }
            className="eisbaer-overlay-button-2"
          >
            {`Youtube ${props.currView == 2 ? "ausblenden" : "einblenden"}`}
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
                input.value = "";
              }}
            >
              +
            </button>
          </div>
          <div className="youtube-link-video-list">
            {youtubeInfos.map((video) => makeVideo(video))}
          </div>
        </SideBarSection>
        <SideBarSection sectionClass="-2" sectionTitle="Slotmachine">
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
              <div className="year-input">
                <input
                  type={"number"}
                  value={year}
                  className="youtube-link"
                  id="year-input"
                  onChange={async (event: React.ChangeEvent) => {
                    let input = event.currentTarget as HTMLInputElement;
                    setYear(Number(input.value));
                  }}
                />
                <div
                  className="add-to-already-taken"
                  onClick={(event: React.MouseEvent) => {
                    let input = document.getElementById(
                      "year-input"
                    ) as HTMLInputElement;
                    if (
                      !props.alreadyTakenYears.includes(Number(input.value))
                    ) {
                      props.setAlreadyTakenYears(Number(input.value));
                    }
                  }}
                >
                  <BsPlus />
                </div>
                <div
                  className="rem-from-already-taken"
                  onClick={(event: React.MouseEvent) => {
                    let input = document.getElementById(
                      "year-input"
                    ) as HTMLInputElement;
                    if (
                      props.alreadyTakenYears.includes(Number(input.value))
                    ) {
                      props.remAlreadyTakenYears(Number(input.value));
                    }
                  }}
                >
                  <FiMinus />
                </div>
                <div className="set-current-year" onClick={(event:React.MouseEvent)=>{
                  let input = document.getElementById('year-input') as HTMLInputElement
                  props.yearSetter(Number(input.value))
                }}>
                  <BsCheck />
                </div>
              </div>
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
              <span className="already-taken">Bereits gewählte Jahre:<br/>{props.alreadyTakenYears.join(", ")}</span>
            </>
          )}
        </SideBarSection>
        <SideBarSection sectionClass="-2" sectionTitle="Virtual Dj">
          <div className="vdj-sidebar-section">
            <input
              type={"checkbox"}
              defaultChecked={props.useVirtualDJ}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                props.setUseVirtualDj(!props.useVirtualDJ);
              }}
              id="virtual-dj-check"
              className="virtual-dj-check"
            />
            Virtual DJ benutzen
          </div>
        </SideBarSection>
        <SideBarSection sectionClass="-2" sectionTitle="Fenster neu laden">
          <button className="eisbaer-overlay-button-2" onClick={(event:React.MouseEvent)=>{event.preventDefault(); props.reloadWindow()}}>Neu Laden</button>
        </SideBarSection>
      </div>
    </>
  );
}
