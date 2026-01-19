import React from "react";
import HeaderLandPage from "../Components/Header/HeaderLandPage";
import logo from '../Assets/Section1.jpg';

export default function Landpage() {
    return (
        <div className="bg-black min-h-screen w-screen overflow-x-hidden m-0 p-0">
            <HeaderLandPage />
             <section>
                <img src={logo} alt="Section 1" />
             </section>
        </div>
    );
}
