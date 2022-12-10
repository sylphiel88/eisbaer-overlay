import Image from "next/image";
import React, { useEffect, useState } from "react";
import slotmachineimg from "../../assets/images/slot.png";

export default function SlotMachine(props: {
  yearSetter: Function;
  year: number;
  numberOfTurns: number;
  setCurrView: Function;
  addTakenYear: Function;
  alreadyTakenYears: number[];
}) {
  const values = [
    [1, 2],
    Array.from(Array(10).keys()),
    Array.from(Array(10).keys()),
    Array.from(Array(10).keys()),
  ];
  const [top, setTop] = useState<number[]>([0, 0, 0, 0]);
  const [number, setNumber] = useState<number[]>([1, 0, 0, 0]);
  const [currTurns, setCurrTurns] = useState<number>(0);
  const [turns, setTurns] = useState<number[]>([]);
  const [showResult, setShowResult] = useState<boolean>(false);

  useEffect(() => {
    let tempTurns = Array.from(Array(Number(props.numberOfTurns)).keys());
    setTurns(tempTurns);
  }, [props.numberOfTurns]);

  function numberSetter(currTurn: number) {
    currTurn += 1;
    var year = 1000;
    var years = Array.from(Array(44).keys())
    years.push(-9)
    years = years.map((val) => val + 1979)
      .filter((curYear) => !props.alreadyTakenYears.includes(curYear));
    console.log(years)
    while (year === 1000) {
      var index = Math.floor(Math.random() * years.length) + 1;
      year = years[index];
    }
    var thousand = Math.floor(year / 1000);
    var hundred = Math.floor((year - 1000 * thousand) / 100);
    var tens = Math.floor((year - 1000 * thousand - 100 * hundred) / 10);
    var digit = Math.floor(year - 1000 * thousand - 100 * hundred - 10 * tens);
    setNumber([thousand, hundred, tens, digit]);
    if (currTurn >= props.numberOfTurns && year !== 1000) {
      setCurrTurns(0);
      props.yearSetter(year);
      props.addTakenYear(year);
      showYear();
    }
  }

  function showYear() {
    setShowResult(true);
    setTimeout(() => {
      setShowResult(false);
      props.setCurrView(0);
    }, 5000);
  }

  useEffect(() => {
    var thousand = Math.floor(props.year / 1000);
    var hundred = Math.floor((props.year - 1000 * thousand) / 100);
    var tens = Math.floor((props.year - 1000 * thousand - 100 * hundred) / 10);
    var digit = Math.floor(
      props.year - 1000 * thousand - 100 * hundred - 10 * tens
    );
    setNumber([thousand, hundred, tens, digit]);
  }, [props.year]);

  useEffect(() => {
    setTop(
      number.map((n, i) => {
        return i === 0 ? 35 - 35 * n : -35 * n;
      })
    );
  }, [number]);

  useEffect(() => {
    setCurrTurns(currTurns + 1);
  }, [top]);

  function makeSlot(values: number[], index: number) {
    return (
      <div className="slot-wrapper">
        <div className="slots" style={{ top: `${top[index]}vh` }}>
          {values.map((v) => (
            <div key={"slot_" + index + "_" + v}>
              <span>{v}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="slot-machine-wrapper">
      <img
        src={"http://localhost:3000/" + slotmachineimg.src}
        className="slot-machine-image"
        alt=""
      />
      <div className="slot-machine">{values.map((v, i) => makeSlot(v, i))}</div>
      <button
        className="eisbaer-overlay-button slot-button"
        style={{ marginTop: "20px" }}
        onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
          turns.forEach((t) => {
            setTimeout(() => numberSetter(t), t * 500);
          });
        }}
      >
        SPIN!
      </button>
      {showResult && (
        <div className="shadow-overlay">
          <div className="year-result">
            {props.year}
            <span className="exclamation-1"> !</span>
            <span className="exclamation-2"> !</span>
            <span className="exclamation-3"> !</span>
          </div>
        </div>
      )}
    </div>
  );
}
