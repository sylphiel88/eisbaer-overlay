import React, { ReactNode, useCallback, useEffect, useState } from "react";
import { BsFillArrowUpCircleFill, BsFillArrowDownCircleFill, BsArrowUpRight } from 'react-icons/bs'

interface SideBarSection {
    children: ReactNode,
    sectionTitle: string,
    sectionClass: string
}

export default function SideBarSection({children, sectionTitle, sectionClass}:SideBarSection){

    const [sectionOpen, setOpen] = useState<boolean>(false)

    return (
            <div className={`sidebar-section-list-item${sectionClass}`} data-name={sectionTitle}>
                <div className="icon-section" onClick={(event:React.MouseEvent<HTMLDivElement>)=>{setOpen(!sectionOpen)}}>
                {sectionOpen ? <BsFillArrowUpCircleFill/> : <BsFillArrowDownCircleFill/>}
                </div>
                {sectionOpen ? children : <div>{`Klicken um ${sectionTitle  } zu öffnen`}</div>}
            </div>
    )
}