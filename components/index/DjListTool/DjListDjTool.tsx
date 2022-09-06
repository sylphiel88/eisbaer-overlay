import React, { useCallback, useEffect, useState } from "react";
import axiosInstance from "../../../models/axiosInstance";
import { RiDeleteBin2Fill } from "react-icons/ri";

export default function DjListDjTool() {
  const [djs, setDjs] = useState<any[]>();
  const [newDj, setNewDj] = useState<string>();

  const setNewDjCallback = useCallback(
    async(event: React.ChangeEvent<HTMLInputElement>) => {
      console.log(event.currentTarget.value);
      setNewDj(event.currentTarget.value);
    },
    []
  );
  const createDjCallback = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      createDj(newDj);  
    },
    [newDj]
  );
  const deleteDJCallback = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      deleteDj(event.currentTarget.id);
    },
    []
  );

  useEffect(() => {
    axiosInstance.get("http://localhost:5000/getDjs").then((res) => {
      setDjs(res.data);
    });
  }, []);

  const makeDj = (dj: any) => {
    return (
      <>
        <div className="one-dj-wrapper">
          <div>{dj.name}</div>
          <div
            id={dj.name}
            className="remove-dj-list"
            onClick={deleteDJCallback}
          >
            <RiDeleteBin2Fill />
          </div>
        </div>
      </>
    );
  };

  const createDj = (name: string | undefined) => {
    if (name !== undefined) {
      axiosInstance
        .post("http://localhost:5000/makeDj", { name: `${name}` })
        .then((res) => {
          setDjs(res.data);
        });
    }
  };

  const deleteDj = (name: string | undefined) => {
    if (name !== undefined) {
      axiosInstance
        .post("http://localhost:5000/deleteDj", { name: `${name}` })
        .then((res) => {
          setDjs(res.data);
        });
    }
  };

  return (
    <>
      <div className="dj-list-dj-tool-section" data-name="Aktuelle Djs">
        {djs?.map((dj) => makeDj(dj))}
      </div>
      <div className="dj-list-dj-tool-section" data-name="Dj erstellen">
        <input
          type={"text"}
          onChange={setNewDjCallback}
          className="youtube-link"
        />
        <button onClick={createDjCallback} className="eisbaer-overlay-button-3">
          Erzeuge Dj
        </button>
      </div>
    </>
  );
}
