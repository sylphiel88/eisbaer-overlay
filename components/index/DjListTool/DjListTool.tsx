import { useEffect, useState } from "react";
import DjListDjListTool from "./DjListDjListTool";
import DjListDjTool from "./DjListDjTool";
import DjListEventTool from "./DjListEventTool";
import DjListItem from "./DjListItem";
import DjListPreviewTool from "./DjListPreviewTool";

export default function DjListTool() {
  const menuItems = [
    "aktuellen DJ-Plan erstellen",
    "DJs",
    "Veranstaltungen",
    "Vorschau Monatsplan",
  ];
  const [activeItem, setActiveItem] = useState<number>(0);

  function makeItems(item: string, index: number) {
    return (
      <DjListItem
        isActive={index === activeItem}
        title={item}
        index={index}
        setActiveItem={setActiveItem}
      />
    );
  }

  return (
    <>
      <div className="dj-tool">
        <div className="dj-tool-sidebar-wrapper">
          {menuItems.map((item, index) => {
            return makeItems(item, index);
          })}
        </div>
        <div className="dj-list-content">
          {activeItem === 0 && <DjListDjListTool />}
          {activeItem === 1 && <DjListDjTool />}
          {activeItem === 2 && <DjListEventTool />}
          {activeItem === 3 && <DjListPreviewTool />}
        </div>
      </div>
    </>
  );
}
