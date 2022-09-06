import { useCallback, useEffect, useState } from "react";

interface DjListItem {
  isActive: boolean;
  title: string;
  index: number;
  setActiveItem: Function;
}

export default function DjListItem({ isActive, title, index, setActiveItem }: DjListItem) {
  const setNewActive = useCallback(()=>{setActiveItem(index)},[])

  return (
    <>
      <div className={`dj-list-sidebar-item${isActive?`-active`:`-not-active`}`} onClick={setNewActive}>{title}</div>
    </>
  );
}
