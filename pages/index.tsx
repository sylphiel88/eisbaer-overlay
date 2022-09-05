import type { NextPage } from "next";
import Head from "next/head";
import React, { useEffect, useState } from "react";
import SideBar from "../components/index/SideBar";
import SlotMachine from "../components/index/SlotMachine";
import TopBar from "../components/index/TopBar";
import YoutubeIFrame from "../components/index/YoutubeIFrame";
import axiosInstance from "../models/axiosInstance";
import NowPlaying from "../components/index/NowPlaying";
import PlayListViewer from "../components/index/PlayListViewer";
import DjListTool from "../components/index/DjListTool/DjListTool";


const Home: NextPage<{recordSongs: boolean, client_id: string, client_secret: string}> = ({recordSongs, client_id, client_secret}) => {
  const [token, setToken] = useState("");
  const [useSpotify, setUseSpotify] = useState<boolean>(false);
  const [useSlotMachine, setUseSlotMachine] = useState<boolean>(false);
  const [currView, setCurrView] = useState<number>(0);
  const [youtubeLinks, setYoutubeLinks] = useState<string[]>([]);
  const [year, setYear] = useState<number>();
  const [numberOfTurns, setNumberOfTurns] = useState<number>(30);
  const [refreshToken, setRefreshToken] = useState<string>("")
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string>("")
  const [useVirtualDJ, setUseVirtualDJ] = useState<boolean>(false)
  const [virtualDJData, setVirtualDJData] = useState<any>()

  const views = ["Now Playing", "Slotmachine", "Youtube", "Playlisten", "Dj-Plan"];

  useEffect(() => {
    let newToken = window.localStorage.getItem("token");
    if (newToken) {
      setToken(newToken);
    }
  }, []);

  useEffect(()=>{
    if(useVirtualDJ!==undefined && useVirtualDJ){
      axiosInstance.get('http://localhost:5000/getCurrentSong').then((res)=>{
        setVirtualDJData(res.data)
      })
    }
  })

  useEffect(()=>{
    if(currView!==2){
      setCurrentlyPlaying("")
    }
  },[currView])

  const useSpotifyHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
    setUseSpotify(!useSpotify);
  };


  function changeCurrView(num?: number) {
    if (num !== undefined) {
      if (num <= views.length) {
        setCurrView(num);
      }
    } else {
      if (currView === views.length - 1) {
        setCurrView(0);
      } else {
        setCurrView(currView + 1);
      }
    }
  }

  const slotMachineSetter = () => {
    setUseSlotMachine(!useSlotMachine);
  };

  const refreshTokenSetter = (token:string) => {
    setRefreshToken(token)
  }

  const addYoutubeLink = (link:string) => {
    setYoutubeLinks([...youtubeLinks, link])
  }

  const removeVideo = (video:any) => {
    setYoutubeLinks(youtubeLinks.filter(vid=>vid!==video))
  }

  return (
    <>
      <Head>
        <title>Eisbär Overlay</title>
      </Head>
      <main className="overlay-main">
        <div className="header">
          <TopBar
            setCurrView={changeCurrView}
            views={views}
            currView={currView}
          />
        </div>
        <div className="side-bar-left">
          <SideBar
            useSpotifyHandler={useSpotifyHandler}
            setCurrView={changeCurrView}
            views={views}
            currView={currView}
            addYoutubeLink={addYoutubeLink}
            youtubeLinks={youtubeLinks}
            spotifyRunning={useSpotify}
            useSlotMachine={useSlotMachine}
            slotMachineSetter={slotMachineSetter}
            slotMachineYear={year ? year : 1000}
            numberOfTurns={numberOfTurns}
            setNumberOfTurns={setNumberOfTurns}
            setRefreshToken={refreshTokenSetter}
            removeVideo={removeVideo}
            setCurrentlyPlaying={setCurrentlyPlaying}
            useVirtualDJ={useVirtualDJ}
            setUseVirtualDj={setUseVirtualDJ}
            clientId={client_id}
            clientSecret={client_secret}
            refreshToken={refreshToken}
          />
        </div>
        <div className="content">
          <div className="eisbaer-overlay">
            {currView == 0 && (
              <NowPlaying
                token={token}
                useSpotify={useSpotify}
                year={year && useSlotMachine ? year : 1000}
                refreshToken={refreshToken}
                useVirtualDj={useVirtualDJ}
                virtualDJData={virtualDJData}
                record = {recordSongs}
              />
            )}
            {currView == 1 && (
              <SlotMachine
                yearSetter={setYear}
                year={year && useSlotMachine ? year : 1000}
                numberOfTurns={numberOfTurns}
                setCurrView={setCurrView}
              />
            )}
            {currView == 2 && <YoutubeIFrame youtubeLink={currentlyPlaying!=="" && currentlyPlaying!==undefined ? currentlyPlaying : ""} />}
            {currView == 3 && <PlayListViewer />}
            {currView == 4 && <DjListTool/>}
          </div>
        </div>
        <div className="side-bar-right"></div>
        <div className="footer"></div>
      </main>
    </>
  );
};

Home.getInitialProps = async(ctx) => {
  const recordSongs = process.env.RECORD_SONGS === "1"
  const client_id = process.env.SPOTIFY_CLIENT_ID
  const client_secret = process.env.SPOTIFY_CLIENT_SECRET
  return { recordSongs: recordSongs, client_id: client_id, client_secret: client_secret }
}

export default Home;
