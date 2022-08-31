import React, { useEffect, useState } from "react";
import querystring from "query-string";

export default function SideBar(props: {
  useSpotifyHandler: React.MouseEventHandler<HTMLButtonElement>;
  setCurrView: Function;
  currView: number;
  views: string[];
  setYoutubeLink: Function;
  spotifyRunning: boolean;
  useSlotMachine: boolean;
  slotMachineSetter: Function;
  slotMachineYear: number;
  numberOfTurns: number;
  setNumberOfTurns: Function;
  setRefreshToken: Function;
}) {
  const SCOPE = "user-read-currently-playing";
  const REDIRECT_URI =
    "http://localhost:3000/api/spotify/authorizationCodeCallback";
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
              props.setCurrView(2)
            }
            className="eisbaer-overlay-button-2"
          >
            Youtube anzeigen
          </button>
          <div className="youtube-flex-wrapper">
            <input
              className="youtube-link"
              type={"text"}
              onChange={async (e: React.ChangeEvent<HTMLInputElement>) => {
                props.setYoutubeLink(
                  e.currentTarget.value.includes("?v=")
                    ? e.currentTarget.value.split("=")[1]
                    : ""
                );
              }}
            />
            <button className="youtube-accept-button">+</button>
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
      </div>
    </>
  );
}
