import React, { useCallback, useEffect, useState } from "react";
import axiosInstance from "../../../models/axiosInstance";
import { RiDeleteBin2Fill } from "react-icons/ri";

export default function DjListEventTool() {
  const [events, setEvents] = useState<any[]>();
  const [newEvent, setNewEvent] = useState<string>();
  const [newCatchphrase, setNewCatchphrase] = useState<string>();

  const setNewEventCallback = useCallback(
    async(event: React.ChangeEvent<HTMLInputElement>) => {
      setNewEvent(event.currentTarget.value);
    },
    []
  );

  const setNewCatchphraseCallback = useCallback(
    async(event: React.ChangeEvent<HTMLInputElement>) => {
      setNewCatchphrase(event.currentTarget.value);
    },
    []
  );

  const createEventCallback = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      createEvent();
    },
    [newEvent, newCatchphrase]
  );
  const deleteEventCallback = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      deleteEvent(event.currentTarget.id);
    },
    [events]
  );

  useEffect(() => {
    axiosInstance.get("http://localhost:5000/getEvents").then((res) => {
      setEvents(res.data);
    });
  }, []);

  const makeEvent = (event: any) => {
    return (
      <>
        <div className="one-dj-wrapper">
          <div>{event.name}</div>
          <div
            id={event.name}
            className="remove-dj-list"
            onClick={deleteEventCallback}
          >
            <RiDeleteBin2Fill />
          </div>
        </div>
      </>
    );
  };

  const createEvent = () => {
    
    if (newEvent!== undefined && newCatchphrase!==undefined) {
      axiosInstance
        .post("http://localhost:5000/makeEvent", { name: `${newEvent}`, catchphrase:`${newCatchphrase}` })
        .then((res) => {
          setEvents(res.data);
        });
    }
  };

  const deleteEvent = (name: string | undefined) => {
    if (name !== undefined) {
      axiosInstance
        .post("http://localhost:5000/deleteEvent", { name: `${name}` })
        .then((res) => {
          setEvents(res.data);
        });
    }
  };

  return (
    <>
      <div className="dj-list-dj-tool-section" data-name="Aktuelle Djs">
        {events?.map((event) => makeEvent(event))}
      </div>
      <div className="dj-list-dj-tool-section" data-name="Dj erstellen">
        Name: <input
          type={"text"}
          onChange={setNewEventCallback}
          className="youtube-link"
          value={newEvent}
        />
        <br/>
        Catchphrase: <input
        type={"text"}
        onChange={setNewCatchphraseCallback}
        className="youtube-link"
        style={{marginTop:"5px"}}
        value={newCatchphrase}
      />
        <button onClick={createEventCallback} className="eisbaer-overlay-button-3">
          Erzeuge Event
        </button>
      </div>
    </>
  );
}
