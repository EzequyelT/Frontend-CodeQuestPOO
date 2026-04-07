import { useNavigate } from "react-router-dom"
import {  Settings, House, Undo2 } from "lucide-react";


export default function LeftSideBar() {
    const navigate = useNavigate();

    return (
        <div>
            <h1>Perfil</h1>
            <div className="grid grid-cols-2 gap-2">
                {/* TODO: data.streak */}
                <div
                    className="rounded-xl p-2.5 flex flex-col items-center gap-1"
                    style={{
                        background: "rgba(239,68,68,0.08)",
                        border: "1px solid rgba(239,68,68,0.2)",
                    }}
                >
                    <span className="text-xl">🔥</span>
                    <span className="text-gray-500 text-[9px]">dias seguidos</span>
                </div>

                {/* TODO: data.coins */}
                <div
                    className="rounded-xl p-2.5 flex flex-col items-center gap-1"
                    style={{
                        background: "rgba(212,160,23,0.08)",
                        border: "1px solid rgba(212,160,23,0.2)",
                    }}
                >
                    <span className="text-xl">🪙</span>
                    <span className="text-gray-500 text-[9px]">coins</span>
                </div>
            </div>

     //_________________
            <House />
            <h1>Perfil</h1>
            <Settings />
            <button onClick={() => navigate("/Maps")}>
                <Undo2 />
            </button>
        </div>
    )
}