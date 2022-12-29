import axios from "axios";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import eisbaerlogo from "../../assets/images/eisbaerlogo.png";
import spotifylogo from "../../assets/images/Spotify_Logo.png";
import virtuallogo from "../../assets/images/vdj.png";
import platte from "../../assets/images/platte.png";
import axiosInstance from "../../models/axiosInstance";
import Marquee from 'react-fast-marquee'

type PartyEvent = {
  date: string,
  event: string,
  djs: string[]
}

export default function SpotifyNowPlaying(props: {
  token: string | undefined;
  useSpotify: boolean;
  year: number;
  refreshToken: string;
  useVirtualDj: boolean;
  virtualDJData: any;
  record: boolean;
}) {
  const [response, setResponse] = useState<any>();
  const [duration, setDuration] = useState<number>(0);
  const [artist, setArtist] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [currPos, setCurrPos] = useState<number>(0);
  const [albumTitle, setAlbumTitle] = useState<string>("");
  const [width, setWidth] = useState<number>(0);
  const [refreshSpotify, setRefreshSpotify] = useState<number>(0);
  const [events, setEvents] = useState<PartyEvent[]>()

  const year = new Date().getFullYear()
  const month = new Date().getMonth() + 1

  useEffect(() => {
    if (year !== undefined && month !== undefined) {
      axiosInstance.get(
        `http://localhost:5000/loadCurrEvents?month=${month}&year=${year}`
      ).then((res) => {
        setEvents(res.data)
      })
    }
  }, [year, month])

  useEffect(() => {
    if (events !== undefined) {
      let filteredEvents = events.filter(ev => {
        return (Number(/\d\d\d\d-\d\d-(\d\d)/.exec(ev.date)!["1"])) > new Date().getDate()
      })
      if(filteredEvents.length != events.length){
        setEvents(filteredEvents)
      }
    }
  }, [events])

  useEffect(() => {
    if (props.useSpotify && !props.useVirtualDj) {
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
            images: [],
          },
        },
      });
    }
  }, [props.useSpotify, props.useVirtualDj]);

  useEffect(() => {
    if (props.record) {
      axiosInstance.put("http://localhost:5000/putCurrentSong", {
        artist: artist,
        song: title,
      });
    }
  }, [artist, title]);

  useEffect(() => {
    if (props.useSpotify === true) {
      getCurrentTitle(undefined);
    } else {
      setRefreshSpotify(0);
    }
  }, [props.useSpotify, refreshSpotify]);

  useEffect(() => {
    if (props.useVirtualDj && props.virtualDJData !== undefined) {
      setArtist(props.virtualDJData["artist"]);
      setTitle(props.virtualDJData["song"]);
    }
  }, [props.useVirtualDj, props.virtualDJData]);

  useEffect(() => {
    setWidth((currPos / duration) * 100);
  }, [currPos, duration]);

  useEffect(() => {
    setDuration(response?.item?.duration_ms);
    setArtist(
      response?.item?.artists.length > 0 ? response.item.artists[0].name : ""
    );
    setTitle(response?.item?.name);
    setCurrPos(response?.progress_ms);
    setAlbumTitle(response?.item?.album?.name);
  }, [response]);

  function getCurrentTitle(e: React.MouseEvent<HTMLButtonElement> | undefined) {
    if (props.useSpotify && !props.useVirtualDj) {
      axios
        .post(
          `http://localhost:3000/api/spotify/spotify`,
          { refresh_token: props.refreshToken },
          { headers: { "content-type": "application/json" } }
        )
        .then((response) => setResponse(response.data))
        .finally(() => {
          setTimeout(() => setRefreshSpotify(refreshSpotify + 1), 1000);
        });
    } else if (props.useVirtualDj) {
      axios.get(
        `http://localhost:5000/getCurrentSong`)
        .then((res) => {
          setResponse(response.data)
        })
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
      {props.year >= 1980 && (
        <div className="year">{`${props.year}${props.year === 1970 ? "s" : ""}`}</div>
      )}
      <div className="eisbaer-logo">
        <img src={'http://localhost:3000/' + eisbaerlogo.src} alt=""></img>
      </div>
      <div className="album-cover">
        <img
          src={
            !props.useVirtualDj && response?.item?.album?.images.length > 0
              ? response?.item?.album?.images[0].url
              : 'http://localhost:3000/' + platte.src
          }
          alt=""
        />
        <p>{albumTitle}</p>
      </div>
      <div className="progress-wrapper">
        <div className="current-artist">{artist}</div>
        <div className="current-song">{title}</div>
        <div className="spotify-logo-wrapper">
          <p className="spotify-logo-title">Powered By</p>
          <img
            src={!props.useVirtualDj ? 'http://localhost:3000/' + spotifylogo.src : 'http://localhost:3000/' + virtuallogo.src}
            className="spotify-logo"
          />
        </div>

        {!props.useVirtualDj && (
          <div className="progress-bar">
            <div className="progress" style={{ width: `${width}%` }}>
              <div className={`progress-text ${width < 30 ? "left" : "right"}`}>
                {" "}
                {`${formatTime(currPos)} / ${formatTime(duration)}`}
              </div>
            </div>
          </div>
        )}
      </div>
      <div style={{display:"flex", height:"100%", width:"100%", flexDirection:"column", justifyContent:"center", gridColumnStart:"1", gridColumnEnd:"12", gridRowStart:"5", gridRowEnd:"6"}}>
        <Marquee gradient={false} speed={0.5}>
          {
            events?.map(ev=>{
              let tempDate = ev.date;
              let results = (/(\d\d\d\d)-(\d\d)-(\d\d)/).exec(tempDate)
              let day = results!["3"]
              let month = results!["2"]
              return <span style={{fontSize:"25pt", marginLeft:"500px", textShadow:"-5px -5px 10px rgb(200,200,200)"}}>{day}.{month}.&nbsp;{ev.event}&nbsp;</span>
            })
          }
          </Marquee>
          </div>
    </div>
  );
}
