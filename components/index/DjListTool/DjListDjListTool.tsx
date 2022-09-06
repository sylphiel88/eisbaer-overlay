import { Axios, AxiosPromise } from "axios";
import React, { useCallback, useEffect, useState } from "react";
import axiosInstance from "../../../models/axiosInstance";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { BsPlusCircleFill } from "react-icons/bs";

type DjOverlay = {
  date: Date;
  djs: any[];
  index: number;
  currEvents: any[];
  setCurrEvents: Function;
  currentEvent: any;
  open: boolean;
};

export default function DjListDjListTool() {
  const [dates, setDates] = useState<Date[]>();
  const [allEvents, setAllEvents] = useState<any[]>();
  const [allDjs, setAllDjs] = useState<any[]>();
  const [currEvents, setCurrEvents] = useState<any[]>([]);
  const [djOverlay, setDjOverlay] = useState<DjOverlay>({
    date: new Date("1-1-2022"),
    currentEvent: {},
    currEvents: currEvents,
    djs: allDjs ? allDjs : [],
    index: 0,
    open: false,
    setCurrEvents: setCurrEvents,
  });

  const [newDate, setNewDate] = useState<Date>();

  const setCurrEventsEventCallback = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      const index = Number(event.currentTarget.id.split("_")[1]);
      var temp = currEvents;
      temp[index] = { ...temp[index], event: event.currentTarget.value };
      setCurrEvents([...temp]);
    },
    [currEvents]
  );

  const setNewOverlayCallback = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      if (dates !== undefined) {
        const index = Number(event.currentTarget.id.split("_")[1]);
        setDjOverlay({
          currentEvent: currEvents[index].event,
          date: dates[index],
          currEvents: currEvents,
          setCurrEvents: setCurrEvents,
          djs: allDjs ? allDjs : [],
          index: index,
          open: true,
        });
      }
    },
    [allDjs, djOverlay]
  );

  const setNewDateCallback = useCallback(
     (event: React.ChangeEvent<HTMLInputElement>) => {
      setNewDate(new Date(event.currentTarget.value));
    },
    [newDate, allDjs]
  );

  useEffect(() => {
    var promises: AxiosPromise[] = [
      axiosInstance.get("http://localhost:5000/getMonthDates"),
      axiosInstance.get("http://localhost:5000/getEvents"),
      axiosInstance.get("http://localhost:5000/getDjs"),
    ];
    Promise.all(promises).then((res) => {
      var tempCurrEvents: any[] = [];
      setDates(
        res[0].data.map((date: string) => {
          tempCurrEvents.push({ date: date, event: null, djs: [null] });
          return new Date(date);
        })
      );
      setCurrEvents(tempCurrEvents);
      setAllEvents(res[1].data);
      setAllDjs(res[2].data);
    });
  }, []);

  const makeEventOptions = (event: any) => {
    return <option value={event.name}>{event.name}</option>;
  };

  useEffect(() => {
    console.log(dates);
  }, [dates]);

  const makeDate = (date: Date, index: number) => {
    const options = {
      weekday: "short",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    } as Intl.DateTimeFormatOptions;
    return (
      <>
        <div>{date.toLocaleDateString("de-DE", options)}</div>
        <div>
          <select
            id={"event_" + String(index)}
            onChange={setCurrEventsEventCallback}
            defaultValue={currEvents[index].event}
          >
            <option value={0}></option>
            {allEvents?.map((event) => makeEventOptions(event))}
          </select>
        </div>
        <div>
          <button id={`djs_${index}`} onClick={setNewOverlayCallback}>
            Djs auswählen
          </button>
          {currEvents[index].djs.join(", ")}
        </div>
      </>
    );
  };

  const close = useCallback(() => {
    setDjOverlay({ ...djOverlay, open: false });
  }, [djOverlay]);

  const addDate = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      var tempDates = dates ? dates : [];
      var tempEvents = currEvents ? currEvents : [];
      if (
        newDate !== undefined &&
        tempEvents !== undefined &&
        dates !== undefined
      ) {
        if (!dates.includes(newDate)) {
          tempDates.push(newDate);
          tempEvents.push({ date: newDate, event: null, djs: [] });
          setCurrEvents(tempEvents);
          setDates([...tempDates]);
        }
      }
    },
    [dates, newDate]
  );

  return (
    <>
      <div className="dj-list-tool-table">
        {dates && dates?.sort((a,b)=>a.getTime() - b.getTime()).map((date, index) => makeDate(date, index))}
        <div className="dj-list-new-date">
          <input type={"date"} onChange={setNewDateCallback} />
          <div onClick={addDate}>
            <BsPlusCircleFill size={20} />
          </div>
        </div>

        {djOverlay.open && (
          <div className="dj-overlays-wrapper">
            {djOverlay !== undefined && (
              <DjChoiceOverlay {...djOverlay} closeOverlay={close} />
            )}
          </div>
        )}
      </div>
    </>
  );

  interface DjChoiceOverlay {
    date: Date | undefined;
    djs: any[] | undefined;
    index: number | undefined;
    currEvents: any[] | undefined;
    setCurrEvents: Function | undefined;
    currentEvent: any | undefined;
    closeOverlay: React.EffectCallback;
  }

  function DjChoiceOverlay({
    date,
    djs,
    index,
    currEvents,
    setCurrEvents,
    currentEvent,
    closeOverlay,
  }: DjChoiceOverlay) {
    const makeDj = (dj: any) => {
      return (
        <>
          <input
            type={"checkbox"}
            id={dj.name}
            defaultChecked={currEvents[index].djs.includes(dj.name)}
          />
          <label htmlFor={dj.name}>{dj.name}</label>
        </>
      );
    };

    return (
      <>
        <div className="dj-overlay">
          <div onClick={closeOverlay}>
            <IoIosCloseCircleOutline size={20} />
          </div>
          <p style={{ textAlign: "center" }}>
            {date?.toDateString()}
            {currentEvent !== undefined &&
            currentEvent !== null &&
            currentEvent !== 0
              ? ` - ${currentEvent}`
              : ""}
          </p>
          {allDjs?.map((dj) => makeDj(dj))}
          <button
            onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
              var tempEvents = currEvents ? currEvents : [];
              var chosenDjs = allDjs
                ?.filter((dj) => {
                  var cb = document.getElementById(dj.name) as HTMLInputElement;
                  return cb.checked;
                })
                .map((dj) => dj.name);
              tempEvents[index ? index : 0].djs = chosenDjs;
              if (setCurrEvents !== undefined) {
                setCurrEvents(tempEvents ? tempEvents : []);
                close();
              }
            }}
          >
            Abschicken
          </button>
        </div>
      </>
    );
  }
}
