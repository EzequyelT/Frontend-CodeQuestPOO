import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import BgModal from "../../../../assets/Maps/ModalChallenge.png";

/*
  Props:
    isOpen    – boolean  – controla se o modal está visível
    onClose   – () => void – callback ao fechar
    onPlay    – () => void – callback ao clicar em "Entrar no Desafio"
    challenge – {
      nome: string,
      descricao: string,
      xp: number,
      nivel: number,
      dificuldade: "Fácil" | "Médio" | "Difícil"
    }
*/
export default function ModalChallenge({ isOpen, onClose, onPlay, challenge }) {
    const [visible, setVisible] = useState(false);
    const [animatingOut, setAnimatingOut] = useState(false);

    // Abre
    useEffect(() => {
        if (isOpen) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setVisible(true);
            requestAnimationFrame(() => {
                setAnimatingOut(false);
            });
        } else {
            setAnimatingOut(true);
            const timeout = setTimeout(() => {
                setVisible(false);
            }, 300);

            return () => clearTimeout(timeout);
        }
    }, [isOpen]);

    // Fecha com animação de saída
    const handleClose = () => {
        setAnimatingOut(true);
        setTimeout(() => {
            setVisible(false);
            setAnimatingOut(false);
            onClose?.();
        }, 380);
    };

    const handlePlay = () => {
        setAnimatingOut(true);
        setTimeout(() => {
            setVisible(false);
            setAnimatingOut(false);
            onPlay?.();
        }, 300);
    };

    if (!visible) return null;

    const dificuldadeColor = {
        Fácil: "text-emerald-700",
        Médio: "text-amber-700",
        Difícil: "text-red-800",
    };

    return createPortal(
        <>
            {/* ── Keyframes personalizados ─────────────────────────────────── */}
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700&family=EB+Garamond:ital,wght@0,400;0,600;1,400&display=swap');

        @keyframes backdropIn  { from { opacity: 0 } to { opacity: 1 } }
        @keyframes backdropOut { from { opacity: 1 } to { opacity: 0 } }

        @keyframes scrollIn {
          0%   { opacity: 0; transform: scale(0.78) translateY(-28px) rotate(-1deg); }
          60%  { opacity: 1; transform: scale(1.03) translateY(4px)   rotate(0.3deg); }
          100% { opacity: 1; transform: scale(1)    translateY(0)     rotate(0deg); }
        }
        @keyframes scrollOut {
          0%   { opacity: 1; transform: scale(1)    translateY(0)     rotate(0deg); }
          100% { opacity: 0; transform: scale(0.78) translateY(-24px) rotate(1deg); }
        }

        .cq-backdrop-in  { animation: backdropIn  0.10s ease forwards; }
        .cq-backdrop-out { animation: backdropOut 0.90s ease forwards; }
        .cq-scroll-in    { animation: scrollIn  0.95s cubic-bezier(0.34, 1.36, 0.64, 1) forwards; }
        .cq-scroll-out   { animation: scrollOut 0.32s ease-in forwards; }

        .cq-title { font-family: 'Cinzel', serif; }
        .cq-body  { font-family: 'EB Garamond', serif; }

        .cq-btn-primary {
          font-family: 'Cinzel', serif;
          letter-spacing: 0.08em;
          background: linear-gradient(180deg, #92400e 0%, #78350f 100%);
          box-shadow: 0 2px 0 #451a03, inset 0 1px 0 rgba(255,220,130,0.25);
          transition: filter 0.15s, transform 0.1s;
        }
        .cq-btn-primary:hover  { filter: brightness(1.12); }
        .cq-btn-primary:active { transform: translateY(1px); box-shadow: 0 1px 0 #451a03; }

        .cq-btn-secondary {
          font-family: 'EB Garamond', serif;
          font-style: italic;
          transition: color 0.15s;
        }
        .cq-btn-secondary:hover { color: #92400e; }

        .cq-divider {
          border: none;
          height: 1px;
          background: linear-gradient(90deg, transparent, #92400e55, #92400e99, #92400e55, transparent);
        }
      `}</style>

            {/* ── Backdrop ─────────────────────────────────────────────────── */}
            <div
                className={`fixed inset-0 z-100 flex items-center justify-center
          ${animatingOut ? "cq-backdrop-out" : "cq-backdrop-in"}`}
                onClick={handleClose}
            >
                {/* Camada de blur + escurecimento */}
                <div className="absolute inset-0 bg-black/70 backdrop-blur-lg" />

                {/* ── Pergaminho ─────────────────────────────────────────────── */}
                <div
                    className={`relative z-10 select-none
            ${animatingOut ? "cq-scroll-out" : "cq-scroll-in"}`}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Container com a imagem de fundo */}
                    <div
                        className="relative flex flex-col items-center"
                        style={{
                            width: 700,
                            minHeight: 850,
                            backgroundImage: `url(${BgModal})`,
                            backgroundSize: "100% 100%",
                            backgroundRepeat: "no-repeat",
                        }}
                    >
                        {/* Conteúdo centralizado dentro da área legível do pergaminho */}
                        <div className="flex flex-col items-center w-full px-35 pt-18 pb-20 gap-5">

                            {/* Badge de dificuldade */}
                            {challenge?.dificuldade && (
                                <span
                                    className={`cq-body mt-20 text-base font-semibold tracking-widest uppercase
                    ${dificuldadeColor[challenge.dificuldade] ?? "text-amber-800"}`}
                                >
                                    ✦ {challenge.dificuldade} ✦
                                </span>
                            )}

                            {/* Título */}
                            <h2 className="cq-title text-center text-xl  font-bold text-amber-950 leading-snug">
                                {challenge?.nome ?? "Desafio Misterioso"}
                            </h2>

                            <hr className="cq-divider w-full" />

                            {/* Descrição */}
                            <p className=" text-center text-[15px] text-stone-800 leading-relaxed
                             w-full break-words overflow-hidden line-clamp-10">
                                {challenge?.descricao ?? "Prepara-te, aventureiro. O caminho à frente exige coragem e sabedoria."}
                            </p>

                            <hr className="cq-divider w-full " />

                            {/* Stats: XP + Nível */}
                            <div className="flex items-center justify-center gap-8 w-full">
                                <div className="flex flex-col items-center gap-0.5">
                                    <span className="cq-title text-[10px] text-amber-800 tracking-[0.2em] uppercase">
                                        XP
                                    </span>
                                    <span className="cq-title text-2xl font-bold text-amber-950">
                                        {challenge?.xp ?? "—"}
                                    </span>
                                </div>

                                {/* Separador vertical */}
                                <div className="h-10 w-px bg-amber-800/30" />

                                <div className="flex flex-col items-center gap-0.5">
                                    <span className="cq-title text-[10px] text-amber-800 tracking-[0.2em] uppercase">
                                        Nível
                                    </span>
                                    <span className="cq-title text-2xl font-bold text-amber-950">
                                        {challenge?.nivel ?? "—"}
                                    </span>
                                </div>
                            </div>

                            {/* Botão principal */}
                            <button
                                onClick={handlePlay}
                                className="cq-btn-primary w-80 h-10 mt-4 rounded-4xl
                  text-amber-100 text-sm font-bold"
                            >
                                ⚔ &nbsp;Entrar no Desafio
                            </button>

                            {/* Botão secundário */}
                            <button
                                onClick={handleClose}
                                className="cq-btn-secondary text-stone-500 text-sm"
                            >
                                Recuar nas sombras
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>,
        document.body
    );
}