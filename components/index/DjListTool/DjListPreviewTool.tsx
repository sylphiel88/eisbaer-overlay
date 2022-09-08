import { useEffect, useState } from "react";
import axiosInstance from "../../../models/axiosInstance";

export default function DjListPreviewTool() {
  const [month, setMonth] = useState<number>(9);
  const [year, setYear] = useState<number>(2022);
  const [image, setImage] = useState<string>("");
  const [y0, sety0] = useState<number>(650);
  const [fs0, setFs0] = useState<number>(50);
  const [fs1, setFs1] = useState<number>(40);
  const [fs2, setFs2] = useState<number>(34);
  const [deltaY0, setDeltaY0] = useState<number>(100);
  const [deltaY1, setDeltaY1] = useState<number>(50);

  useEffect(() => {
    axiosInstance
      .get(`http://localhost:5000/getPreview?month=${month}&year=${year}&y0=${y0}&fs0=${fs0}&fs1=${fs1}&fs2=${fs2}&deltay0=${deltaY0}&deltay1=${deltaY1}`)
      .then((res) => {
        setImage(res.data);
      });
  }, [month, year, y0, fs0, fs1, deltaY1]);

  return (
    <>
      <div className="preview-wrapper">
        <div className="preview-settings">
          <label htmlFor="month">Monat: </label>
          <input
            type={"number"}
            min={1}
            max={12}
            value={month}
            id="month"
            onChange={async (event: React.ChangeEvent<HTMLInputElement>) => {
              setMonth(Number(event.currentTarget.value));
            }}
          />
          <label htmlFor="year">Jahr: </label>
          <input
            type={"number"}
            min={2022}
            max={2040}
            value={year}
            id="year"
            onChange={async (event: React.ChangeEvent<HTMLInputElement>) => {
              setYear(Number(event.currentTarget.value));
            }}
          />
          <label htmlFor="y0">Abstand oben: </label>
          <input
            type={"number"}
            min={500}
            max={750}
            value={y0}
            id="y0"
            onChange={async (event: React.ChangeEvent<HTMLInputElement>) => {
              sety0(Number(event.currentTarget.value));
            }}
            step={10}
          />
          <label htmlFor="fs0">Schriftgröße (groß): </label>
          <input
            type={"number"}
            min={40}
            max={60}
            value={fs0}
            id="fs0"
            onChange={async (event: React.ChangeEvent<HTMLInputElement>) => {
              setFs0(Number(event.currentTarget.value));
            }}
          />
          <label htmlFor="fs1">Schriftgröße (mittel): </label>
          <input
            type={"number"}
            min={35}
            max={55}
            value={fs1}
            id="fs1"
            onChange={async (event: React.ChangeEvent<HTMLInputElement>) => {
              setFs1(Number(event.currentTarget.value));
            }}
          />
          <label htmlFor="fs2">Schriftgröße (klein): </label>
          <input
            type={"number"}
            min={28}
            max={50}
            value={fs2}
            id="fs2"
            onChange={async (event: React.ChangeEvent<HTMLInputElement>) => {
              setFs2(Number(event.currentTarget.value));
            }}
          />
          <label htmlFor="deltaY1">Abstand zwischen Events: </label>
          <input
            type={"number"}
            min={30}
            max={80}
            value={deltaY1}
            id="deltay1"
            onChange={async (event: React.ChangeEvent<HTMLInputElement>) => {
              setDeltaY1(Number(event.currentTarget.value));
              setDeltaY0(2 * Number(event.currentTarget.value));
            }}
            step={5}
          />
        </div>
        <div className="preview-image-wrapper">
          <img src={`data:image/jpeg;base64,${image}`} />
        </div>
      </div>
    </>
  );
}
