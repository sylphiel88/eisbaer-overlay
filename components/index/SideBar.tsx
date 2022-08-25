import React, { useEffect, useState } from "react";

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
}) {
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
        </div>
        <div className="sidebar-section-list-item" data-name="Youtube">
          <button
            onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
              props.setCurrView(2)
            }
            className="eisbaer-overlay-button"
          >
            Youtube anzeigen
          </button>
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
        </div>
        <div className="sidebar-section-list-item" data-name="Slotmachine">
          <button
            className="eisbaer-overlay-button"
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
              props.slotMachineSetter();
              {!props.useSlotMachine && props.setCurrView(1)};
            }}
          >{`Slotmaschine ${
            props.useSlotMachine ? "ausmachen" : "anmachen"
          }!`}</button>
          {props.useSlotMachine && <><p>{props.slotMachineYear}</p>
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
          <br/>
          <span>{`~ ${props.numberOfTurns/2}s`}</span>
          </>}
        </div>
      </div>
    </>
  );
}
