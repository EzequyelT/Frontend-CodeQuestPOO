import { useEffect, useState } from "react"
import { createPortal } from "react-dom";
import { Navigate, useNavigate } from "react-router-dom";

export default function ModalModalFalha({
    isOpen,
    onRepetir,
    onVoltar,
    correct = 0,
    wrong = 0,
    time = 0,
}) {

    const [visible, setVisible] = useState(false)
    const [animatingOut, setAnimatingOut] = useState(false)

    const navigate = useNavigate()

    const mins = Math.floor(time / 60)
    const secs = time % 60

    const formatTime = (n) => n.toString().padStart(2, "0")

    
    useEffect(() => {
        if (isOpen) {
            setVisible(true);
            requestAnimationFrame(() => setAnimatingOut(false));
        } else {
            setAnimatingOut(true);
            const t = setTimeout(() => setVisible(false), 300);
            return () => clearTimeout(t);
        }
    }, [isOpen]);

    const handleClose = () => {
        setAnimatingOut(false)
        setTimeout(() => {
            setVisible(false),
                setAnimatingOut(false),
                onclose?.()
        }, 380)
        navigate("/FlorestaDosAlgoritmos")
    }

    if (!visible) return null

    return createPortal(
        <div
            className={`fixed inset-0 z-100 flex items-center justify-center
                     backdrop-blur-md bg-black/60
                     ${animatingOut ? "nc-backdrop-out" : "nc-backdrop-in"}`}
            onClick={handleClose}
        >
            <div onClick={(e) => e.stopPropagation()} className="bg-[#0a0a0a] border border-[#1e5a8e]/40 rounded-4xl px-12 py-10 w-[340px]  text-center">

                {/* Ícone */}
                <div className="w-16 h-16 rounded-full bg-[#0a1e32]/80 border animate-pulse border-[#1e5a8e]/50 flex items-center justify-center mx-auto mb-5">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="#3b7ab8" strokeWidth="1.5" />
                        <path d="M12 7v6" stroke="#7ab8ff" strokeWidth="2" strokeLinecap="round" />
                        <circle cx="12" cy="16.5" r="1" fill="#7ab8ff" />
                    </svg>
                </div>

                {/* Título */}
                <p className="text-[11px] tracking-widest text-[#3b7ab8] font-medium mb-1">
                    DESAFIO FALHADO
                </p>
                <h2 className="text-xl font-medium text-[#7ab8ff] mb-2">
                    Não desistas!
                </h2>
                <p className="text-sm text-[#7ab8ff]/55 mb-7 leading-relaxed">
                    Cometeste {wrong} erros consecutivos. Revê os conceitos e tenta novamente.
                </p>

                {/* Stats */}
                <div className="bg-[#0a1e32]/40 border border-[#1e5a8e]/25 rounded-xl px-4 py-3 flex justify-around mb-7">
                    <div>
                        <p className="text-[11px] tracking-widest text-[#7ab8ff]/45 mb-0.5">ERROS</p>
                        <p className="text-xl font-medium text-[#e05a5a]">{wrong}</p>
                    </div>
                    <div className="w-px bg-[#1e5a8e]/25" />
                    <div>
                        <p className="text-[11px] tracking-widest text-[#7ab8ff]/45 mb-0.5">ACERTOS</p>
                        <p className="text-xl font-medium text-[#5a96d8]">{correct}</p>
                    </div>
                    <div className="w-px bg-[#1e5a8e]/25" />
                    <div>
                        <p className="text-[11px] tracking-widest text-[#7ab8ff]/45 mb-0.5">TEMPO</p>
                        <p className="text-xl font-medium text-[#7ab8ff]">
                            {formatTime(mins)}:{formatTime(secs)}
                        </p>
                    </div>
                </div>

                {/* Botões */}
                <button
                    onClick={onRepetir}
                    className="w-full py-3 bg-[#1e5a8e] hover:bg-[#3b7ab8] transition-colors animate-bounce rounded-xl text-[#e8f4ff] text-[15px] font-medium tracking-wide cursor-pointer"
                >
                    Tentar novamente
                </button>

                {onVoltar && (
                    <button
                        onClick={onVoltar}
                        className="w-full py-2.5 mt-2 bg-transparent border border-[#1e5a8e]/30 hover:border-[#1e5a8e]/60 transition-colors rounded-xl text-[#7ab8ff]/50 text-sm cursor-pointer"
                    >
                        Voltar ao mapa
                    </button>
                )}
            </div>
        </div>,
        document.body
    )
}