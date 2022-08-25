import axios from "axios";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import eisbaerlogo from "../../assets/images/eisbaerlogo.png";

export default function SpotifyNowPlaying(props: {
  token: string | undefined;
  useSpotify: boolean;
  year:number;
}) {
  const [response, setResponse] = useState<any>();
  const [duration, setDuration] = useState<number>(0);
  const [artist, setArtist] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [currPos, setCurrPos] = useState<number>(0);
  const [albumTitle, setAlbumTitle] = useState<string>("");
  const [width, setWidth] = useState<number>(0)
  const [refreshSpotify, setRefreshSpotify] = useState<number>(0)

  useEffect(()=>{
    console.log(props.useSpotify)
  },[props.useSpotify])

  useEffect(() => {
    if (props.useSpotify) {
      getCurrentTitle(undefined);
    } else {
      setResponse({
        progress_ms: 260000,
        item: {
          name: "Hello I'm a Song",
          duration_ms: 817000,
          artists: [
            {
              name: "Eisbär Metalkeller",
            },
          ],
          album: {
            images: [
              {
                url: "",
              },
            ],
          },
        },
      });
    }
  }, [props.useSpotify]);

  useEffect(() => {
    if (props.useSpotify===true) {
      getCurrentTitle(undefined);
    } else{
      setRefreshSpotify(0)
    }
  }, [props.useSpotify]);

  useEffect(()=>{
    setWidth(currPos/duration * 100)
  },[currPos, duration])

  useEffect(() => {
    setDuration(response?.item?.duration_ms);
    setArtist(
      response?.item?.artists.length > 0 ? response.item.artists[0].name : ""
    );
    setTitle(response?.item?.name);
    setCurrPos(response?.progress_ms);
    setAlbumTitle(response?.item?.album?.name);
  }, [response]);

  function getCurrentTitle(
    e: React.MouseEvent<HTMLButtonElement> | undefined
  ) {    
    if (props.useSpotify) {
      axios
        .get("http://localhost:3000/api/spotify/spotify")
        .then((response) => setResponse(response.data)).finally(()=>{
          setTimeout(() => setRefreshSpotify(refreshSpotify+1), 1000);
        });
    }
  }

  function formatTime(ms: number): string {
    let minutes = Math.floor(ms / 60000);
    let seconds = Math.floor((ms - minutes * 60000) / 1000);
    let minutesString: string = String(minutes);
    let secondsString: string =
      seconds < 10 ? "0" + String(seconds) : String(seconds);
    return minutesString + ":" + secondsString;
  }

  return (
    <div className="spotify-now-playing">
      {props.year >= 1980 && <div className="year">{props.year}</div>}
      <div className="eisbaer-logo">
        <img src={eisbaerlogo.src} alt=""></img>
      </div>
      <div className="album-cover">
        <img src={response?.item?.album?.images[0].url} alt=""/>
        <p>{albumTitle}</p>
      </div>
      <div className="progress-wrapper">
        <div className="current-artist">{artist}</div>
        <div className="current-song">{title}</div>
        <div className="progress-bar">
          <div
            className="progress"
            style={{ width: `${width}%` }}
          >
            <div className={`progress-text ${width < 10 ? "left" : "right"}`}>
              {" "}
              {`${formatTime(currPos)} / ${formatTime(duration)}`}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
