import { useState } from "react";
import CodeBox from "./codeBox"
import ConsoleBox from "./ConsoleBox"
import Objectives from "./objectives"
import MentorBox from "./MentorBox"

export default function CodeComponent() {
    const [logs, setLogs] = useState([]);

    const addLog = (type, message) => {
        const time = new Date().toLocaleTimeString();

        setLogs(prev => [
            ...prev,
            { type, message, time }
        ]);


    };

    const runCode = async (code) => {
        console.log("Código recebido:", code);

        // simulação de execução
        if (code.includes("error")) {
            return { success: false, message: "Erro simulado no código" };
        }

        return { success: true, message: "Código executado com sucesso!" };
    };

    return (
        <>

            <div className="flex flex-col justify-center items-center h-screen mr-15">

                <CodeBox addLog={addLog} />

                <div className="flex flex-row mt-10 gap-5 mb-5">
                    <MentorBox />
                    <div className="flex flex-col">
                        <Objectives />
                        <ConsoleBox logs={logs} onRun={runCode} />
                    </div>
                </div>

            </div>

        </>
    )
}