import axios from "axios";
import type { NextPage } from "next";
import Head from "next/head";
import React, { useEffect, useState } from "react";
import SideBar from "../components/index/SideBar";
import SlotMachine from "../components/index/SlotMachine";
import SpotifyNowPlaying from "../components/index/SpotifyNowPlaying";
import TopBar from "../components/index/TopBar";
import YoutubeIFrame from "../components/index/YoutubeIFrame";
import axiosInstance from "../models/axiosInstance";

const Home: NextPage = () => {
  const [token, setToken] = useState("");
  const [useSpotify, setUseSpotify] = useState<boolean>(false);
  const [useSlotMachine, setUseSlotMachine] = useState<boolean>(false);
  const [currView, setCurrView] = useState<number>(0);
  const [youtubeLink, setYoutubeLink] = useState<string>("");
  const [year, setYear] = useState<number>();
  const [numberOfTurns, setNumberOfTurns] = useState<number>(30);
  const [refreshToken, setRefreshToken] = useState<string>("")

  const axiosInst = axiosInstance;

  const views = ["Spotify", "Slotmachine", "Youtube"];

  useEffect(() => {
    let newToken = window.localStorage.getItem("token");
    if (newToken) {
      setToken(newToken);
    }
  }, []);

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
            setYoutubeLink={setYoutubeLink}
            spotifyRunning={useSpotify}
            useSlotMachine={useSlotMachine}
            slotMachineSetter={slotMachineSetter}
            slotMachineYear={year ? year : 1000}
            numberOfTurns={numberOfTurns}
            setNumberOfTurns={setNumberOfTurns}
            setRefreshToken={refreshTokenSetter}
          />
        </div>
        <div className="content">
          <div className="eisbaer-overlay">
            {currView == 0 && (
              <SpotifyNowPlaying
                token={token}
                useSpotify={useSpotify}
                year={year && useSlotMachine ? year : 1000}
                refreshToken={refreshToken}
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
            {currView == 2 && <YoutubeIFrame youtubeLink={youtubeLink} />}
          </div>
        </div>
        <div className="side-bar-right"></div>
        <div className="footer"></div>
      </main>
    </>
  );
};

export default Home;
