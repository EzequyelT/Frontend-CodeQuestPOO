import { useEffect, useRef } from "react";

export default function ConsoleBox({ logs = [] }) {
    const bottomRef = useRef(null);

    // auto-scroll
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [logs]);

    const getColor = (type) => {
        switch (type) {
            case "success":
                return "text-green-400";
            case "error":
                return "text-red-400";
            case "warn":
                return "text-yellow-400";
            default:
                return "text-gray-300";
        }
    };

    return (
        <div className="bg-black border-2 border-white border-gray-800 rounded-2xl mt-3 p-3 h-30 w-80 overflow-y-auto font-mono text-xs scrollbar">

            <p className="text-gray-500 font-bold mb-2">Console</p>

            {logs.length === 0 && (
                <p className="text-gray-600">Aguardando execução...</p>
            )}

            {logs.map((log, i) => (
                <div key={i} className={`${getColor(log.type)} mb-1`}>
                    
                    <span className="text-gray-600">
                        [{log.time}]
                    </span>{" "}
                    
                    {log.message}
                </div>
            ))}

            <div ref={bottomRef} />
        </div>
    );
}