import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface ViewWindow {
  close: Function;
  children: React.ReactNode;
  styles: HTMLCollectionOf<HTMLStyleElement> | null;
  currView:number;
}

export default function ViewWindow({ close, children, styles, currView }: ViewWindow) {
  const [container, setContainer] = useState<HTMLDivElement>();

  useEffect(() => {
    setContainer(document.createElement("div"));
  }, []);

  useEffect(() => {
    if (container !== undefined && container !== null) {
      let tempWin = window.open("", "newWin", "width=1920,height=1080,fullscreen=yes");
      tempWin?.moveBy(1920,0)
      if (tempWin !== null) {
        tempWin.onbeforeunload = () => {
          close();
        };
        if (styles !== null) {
          for (let i = 0; i < styles.length; i++) {
            var newStyle = document.createElement("style");
            newStyle.innerHTML = styles[i].innerHTML;
            tempWin.document.head.appendChild(newStyle);
          }
        }
        tempWin.document.body.appendChild(container);
      }
    }
  },[container]);

  return <>{container && createPortal(children, container)}</>;
}
