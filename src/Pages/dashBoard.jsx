import React, { useState, useEffect } from "react";
import DashBoardHeader from "../Components/Header/HeaderDashBoard";
import SideBar from "../Components/SideBar/SideBar";
import BgDashBoard from "../Assets/DashBoard/BgDashBoard.png";
import Heros from "../Assets/DashBoard/Heros.png";
import "../css/DashBoard.css";

export function DashBoard() {

    return (
        <div className="relative min-h-screen">
                <DashBoardHeader />

                <main className="p-6 pt-24">
                  <SideBar />
                  
                </main>
            </div>
    );
}