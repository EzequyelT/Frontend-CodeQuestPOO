import DashBoardHeader from "../../Components/Header/HeaderDashBoard";
import SideBar from "../../Components/SideBar/SideBar";
import map1 from "../../assets/Maps/FirstMap.png";

export default function Maps() {
    return (
        <div className="maps">
            <DashBoardHeader />
            <SideBar />
            <div className="flex items-center justify-center">
                <img
                    src={map1}
                    alt="Mapa 1"
                    className="w-95 h-130 mt-20 transition-transform duration-300 hover:scale-105 cursor-pointer"
                />
            </div>
        </div>
    )
}