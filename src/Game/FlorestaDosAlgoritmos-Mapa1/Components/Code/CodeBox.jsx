import { useState } from "react";
import CodeMirror from '@uiw/react-codemirror';
import { python } from '@codemirror/lang-python';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import { highlightActiveLine } from "@codemirror/view";

export default function CodeBox({
    tituloDoDesafio = "",
    initialCode = "print('Bem vindo ao Code Quest POO')",
    onRun,
    loading = false,
    addLog
}) {
    const [code, setCode] = useState(initialCode)

    const handleRun = async () => {
        addLog("info", "Executando código...");
        console.log("Clicado");
 
        console.log("onRun:", onRun);

        try {
            if (!onRun) {
                addLog("error", "onRun não definido");
                return;
            }

            const result = await onRun(code);

            if (result?.success) {
                addLog("success", result.message || "Sucesso");
            } else {
                addLog("error", result?.message || "Erro");
            }

        } catch (err) {
            addLog("error", err.message);
        }
    };


    return (

        <>

            <div className="flex justify-between items-center gap-100  ">
                <h2 className="text-xs font-mono text-gray-400 font-bold uppercase tracking-wider">
                    {tituloDoDesafio ? tituloDoDesafio : "Titulo"}
                </h2>
                <button
                    onClick={handleRun}
                    disabled={loading}
                    className="text-xs bg-green-500 hover:bg-green-600 disabled:opacity-50  text-white px-6 py-2 mb-1 rounded-full font-bold transition-all duration-200"
                >  
                    {loading ? "Executando..." : "Executar"}
                </button>
            </div>


            {/* Editor Container */}
            <div className="bg-gray-950 border-3  border-gray-800 rounded-3xl mt-1 overflow-hidden shadow-2xl w-165 h-80" style={{ minHeight: '350px' }}>
                {/* Tabs Bar */}
                <div className="flex items-center gap-0 px-3 py-3 border-b-white border-2 border-gray-800 bg-gray-900">
                    {/* Main Tab */}
                    <div className="flex items-center gap-2 px-4 py-2 rounded-md bg-gray-800 border-b-2 border-green-500">
                        <span className="text-xs font-mono text-gray-300 font-semibold">main.py</span>
                        <button className="ml-2 text-gray-400 hover:text-gray-200 text-xs font-bold">
                            ×
                        </button>
                    </div>

                    {/* Close button on right */}
                    <div className="ml-auto">
                        <button className="text-gray-400 hover:text-gray-200 text-sm font-bold">
                            ×
                        </button>
                    </div>
                </div>



                <CodeMirror
                    value={code}
                    height="300px"
                    className="scrollbar"
                    theme={vscodeDark}
                    placeholder="Escreve seu codigo aqui"
                    extensions={[python(), highlightActiveLine()]}
                    onChange={(value) => setCode(value)}
                    style={{
                        textAlign: "left"
                    }}
                />

            </div>

            {/* Info Text */}
            <p className="text-xs text-gray-500 text-right">
                Pressione <span className="text-green-400 font-mono">Executar</span> para rodar o código
            </p>
        </>

    )
}