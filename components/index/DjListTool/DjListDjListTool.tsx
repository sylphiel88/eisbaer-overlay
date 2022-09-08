import axios, { Axios, AxiosPromise } from "axios";
import React, { useCallback, useEffect, useState } from "react";
import axiosInstance from "../../../models/axiosInstance";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { BsPlusCircleFill, BsFillDashCircleFill } from "react-icons/bs";

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
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [month, setMonth] = useState<number>(new Date().getMonth() + 1);

  useEffect(() => {}, [month, year]);

  const [newDate, setNewDate] = useState<Date>();
  const months = [
    "Januar",
    "Februar",
    "März",
    "April",
    "Mai",
    "Juni",
    "Juli",
    "August",
    "September",
    "Oktober",
    "November",
    "Dezember",
  ];

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
    if (month !== undefined && year !== undefined) {
      var promises: AxiosPromise[] = [
        axiosInstance.get(
          `http://localhost:5000/loadCurrEvents?month=${month}&year=${year}`
        ),
        axiosInstance.get("http://localhost:5000/getEvents"),
        axiosInstance.get("http://localhost:5000/getDjs"),
      ];
      Promise.all(promises).then((res) => {
        setDates(
          res[0].data.map((date: any) => {
            return new Date(date.date);
          })
        );
        setCurrEvents([...res[0].data]);
        setAllEvents(res[1].data);
        setAllDjs(res[2].data);
      });
    }
  }, [month, year]);

  const makeEventOptions = (event: any) => {
    return <option value={event.name}>{event.name}</option>;
  };

  useEffect(()=>{
    console.log(currEvents)
  },[currEvents])

  const makeDate = (date: Date, index: number) => {
    const options = {
      weekday: "short",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    } as Intl.DateTimeFormatOptions;
    return (
      <>
        <div style={{ display: "flex", flexDirection: "row" }}>
          {date.toLocaleDateString("de-DE", options)}
          <BsFillDashCircleFill
            style={{ marginLeft: "1em" }}
            size={20}
            id={date.toISOString().split("T")[0]}
            onClick={remDate}
          />
        </div>
        <div>
          <select
            id={"event_" + String(index)}
            onChange={setCurrEventsEventCallback}
            value={currEvents[index].event!==null ? currEvents[index].event : "" }
          >
            <option value={""}></option>
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
      axiosInstance.post('http://localhost:5000/addDate',{date: newDate?.toISOString().split('T')[0], month: month, year: year}).then(()=>{
        axiosInstance.get(`http://localhost:5000/loadCurrEvents?month=${month}&year=${year}`).then((res)=>{
          setDates(
            res.data.map((date: any) => {
              return new Date(date.date);
            })
          );
          setCurrEvents([...res.data]);
        })
      })
    },
    [dates, newDate]
  );

  const sendEvents = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      axiosInstance
        .post("http://localhost:5000/createEvents", {
          events: currEvents,
          month: month,
          year: year,
        })
        .then(()=>{
          axiosInstance.get(`http://localhost:5000/loadCurrEvents?month=${month}&year=${year}`).then((res)=>{
          setDates(
            res.data.map((date: any) => {
              return new Date(date.date);
            })
          );
          setCurrEvents([...res.data]);}
          );
        })},
    [currEvents]
  );

  useEffect(()=>{
    console.log(currEvents)
  },[currEvents])

  const remDate = useCallback(
    (event: React.MouseEvent<SVGAElement>) => {
      const tempDate = event.currentTarget.id;
      console.log(tempDate);
      axiosInstance.post('http://localhost:5000/remDate',{date: tempDate, month: month, year: year}).then(()=>{
        axiosInstance.get(`http://localhost:5000/loadCurrEvents?month=${month}&year=${year}`).then((res)=>{
          setDates(
            res.data.map((date: any) => {
              return new Date(date.date);
            })
          );
          setCurrEvents([...res.data]);
        })
      })
    },
    [dates !== undefined, allDjs !== undefined, dates, currEvents !== undefined]
  );

  return (
    <>
      <div className="month-year-selectors">
        <select
          defaultValue={month}
          onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
            setMonth(Number(event.currentTarget.value));
          }}
        >
          {months.map((m, index) => (
            <option selected={index === month - 1} value={index + 1}>
              {m}
            </option>
          ))}
        </select>
        <input
          type={"number"}
          min={2022}
          max={2040}
          defaultValue={year}
          onChange={async (event: React.ChangeEvent<HTMLInputElement>) => {
            setYear(Number(event.currentTarget.value));
          }}
        ></input>
      </div>
      <div className="dj-list-tool-table">
        {dates &&
          dates
            ?.sort((a, b) => a.getTime() - b.getTime())
            .map((date, index) => makeDate(date, index))}
        <div className="dj-list-new-date">
          <input type={"date"} onChange={setNewDateCallback} />
          <div onClick={addDate}>
            <BsPlusCircleFill size={20} />
          </div>
        </div>
        <div className="dj-list-send-dj-list">
          <button onClick={sendEvents}>Abschicken</button>
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
      if (currEvents !== undefined && index !== undefined && dj.name !== "") {
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
      }
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
                  return dj.name !== "" && cb.checked;
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
