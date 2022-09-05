import { useEffect, useState } from "react";
import DjListDjListTool from "./DjListDjListTool";
import DjListDjTool from "./DjListDjTool";
import DjListEventTool from "./DjListEventTool";
import DjListItem from "./DjListItem";

export default function DjListTool() {
  const menuItems = ["DJs", "Veranstaltungen", "DJ-Plan"];
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
          {activeItem===0 && <DjListDjTool/>}
          {activeItem===1 && <DjListEventTool/>}
          {activeItem===2 && <DjListDjListTool/>}
        </div>
      </div>
    </>
  );
}
