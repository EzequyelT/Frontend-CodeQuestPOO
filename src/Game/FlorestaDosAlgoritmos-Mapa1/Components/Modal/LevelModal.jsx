import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import BgModal from "../../../../assets/Maps/ModalChallenge.png"; // mesma imagem

/*
  Props:
    isOpen       – boolean
    onClose      – () => void
    onContinuar  – () => void  → navega para o próximo nível
    nivelNome    – string      → ex: "Nível 1 — Fundamentos"
    xpGanho      – number      → total de XP ganho
    proximoNivel – {
      nivel: number,
      desafios: Array<{ id, titulo, descricao, xp_recompensa, ordem }>
    } | null     → null = fim do jogo
*/
export default function ModalNivelConcluido({
    isOpen,
    onClose,
    onContinuar,
    nivelNome,
    xpGanho,
    proximoNivel,
}) {
    const [visible, setVisible] = useState(false);
    const [animatingOut, setAnimatingOut] = useState(false);

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
        setAnimatingOut(true);
        setTimeout(() => {
            setVisible(false);
            setAnimatingOut(false);
            onClose?.();
        }, 380);
    };

    const handleContinuar = () => {
        setAnimatingOut(true);
        setTimeout(() => {
            setVisible(false);
            setAnimatingOut(false);
            onContinuar?.();
        }, 300);
    };

    // Converte número para algarismo romano simples (1–20 chega)
    const toRoman = (n) => {
        const map = [[10,'X'],[9,'IX'],[5,'V'],[4,'IV'],[1,'I']];
        return map.reduce((acc, [val, sym]) => {
            while (n >= val) { acc += sym; n -= val; }
            return acc;
        }, '');
    };

    if (!visible) return null;

    return createPortal(
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700&family=EB+Garamond:ital,wght@0,400;0,600;1,400&display=swap');

                @keyframes ncBackdropIn  { from { opacity:0 } to { opacity:1 } }
                @keyframes ncBackdropOut { from { opacity:1 } to { opacity:0 } }

                @keyframes ncScrollIn {
                    0%   { opacity:0; transform: scale(0.78) translateY(-28px) rotate(-1deg); }
                    60%  { opacity:1; transform: scale(1.03) translateY(4px)   rotate(0.3deg); }
                    100% { opacity:1; transform: scale(1)    translateY(0)     rotate(0deg); }
                }
                @keyframes ncScrollOut {
                    0%   { opacity:1; transform: scale(1)    translateY(0)     rotate(0deg); }
                    100% { opacity:0; transform: scale(0.78) translateY(-24px) rotate(1deg); }
                }
                @keyframes ncCrownBounce {
                    from { transform: scale(0) rotate(-20deg); opacity:0; }
                    to   { transform: scale(1) rotate(0);      opacity:1; }
                }
                @keyframes ncStarPop {
                    from { transform: scale(0) rotate(-15deg); opacity:0; }
                    80%  { transform: scale(1.3) rotate(5deg); }
                    to   { transform: scale(1) rotate(0); opacity:1; }
                }

                .nc-backdrop-in  { animation: ncBackdropIn  0.10s ease forwards; }
                .nc-backdrop-out { animation: ncBackdropOut 0.30s ease forwards; }
                .nc-scroll-in    { animation: ncScrollIn  0.95s cubic-bezier(0.34,1.36,0.64,1) forwards; }
                .nc-scroll-out   { animation: ncScrollOut 0.32s ease-in forwards; }

                .nc-title  { font-family: 'Cinzel', serif; }
                .nc-body   { font-family: 'EB Garamond', serif; }

                .nc-crown  { animation: ncCrownBounce 0.6s 0.5s cubic-bezier(0.34,1.56,0.64,1) both; }

                .nc-star-1 { animation: ncStarPop 0.4s 0.60s cubic-bezier(.36,.07,.19,.97) both; }
                .nc-star-2 { animation: ncStarPop 0.4s 0.75s cubic-bezier(.36,.07,.19,.97) both; }
                .nc-star-3 { animation: ncStarPop 0.4s 0.90s cubic-bezier(.36,.07,.19,.97) both; }

                .nc-btn-primary {
                    font-family: 'Cinzel', serif;
                    letter-spacing: 0.08em;
                    background: linear-gradient(180deg, #92400e 0%, #78350f 100%);
                    box-shadow: 0 2px 0 #451a03, inset 0 1px 0 rgba(255,220,130,0.25);
                    transition: filter 0.15s, transform 0.1s;
                }
                .nc-btn-primary:hover  { filter: brightness(1.12); }
                .nc-btn-primary:active { transform: translateY(1px); box-shadow: 0 1px 0 #451a03; }

                .nc-btn-secondary {
                    font-family: 'EB Garamond', serif;
                    font-style: italic;
                    transition: color 0.15s;
                }
                .nc-btn-secondary:hover { color: #451a03; }

                .nc-divider {
                    border: none; height: 1px;
                    background: linear-gradient(90deg, transparent, #92400e55, #92400e99, #92400e55, transparent);
                }
            `}</style>

            {/* Backdrop */}
            <div
                className={`fixed inset-0 z-100 flex items-center justify-center
                    ${animatingOut ? "nc-backdrop-out" : "nc-backdrop-in"}`}
                onClick={handleClose}
            >
                <div className="absolute inset-0 bg-black/70 backdrop-blur-lg" />

                {/* Pergaminho */}
                <div
                    className={`relative z-10 select-none
                        ${animatingOut ? "nc-scroll-out" : "nc-scroll-in"}`}
                    onClick={(e) => e.stopPropagation()}
                >
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
                        <div className="flex flex-col items-center w-full px-35 pt-18 pb-20 gap-4">

                            {/* Coroa animada */}
                            <span className="nc-crown mt-16 text-5xl">👑</span>

                            {/* Estrelas */}
                            <div className="flex gap-2 text-xl">
                                <span className="nc-star-1">⭐</span>
                                <span className="nc-star-2">⭐</span>
                                <span className="nc-star-3">⭐</span>
                            </div>

                            {/* Eyebrow */}
                            <span className="nc-title text-[10px] tracking-[0.3em] uppercase text-amber-800 font-semibold">
                                ✦ Missão Cumprida ✦
                            </span>

                            {/* Título */}
                            <h2 className="nc-title text-center text-xl font-bold text-amber-950 leading-snug">
                                {nivelNome ?? "Nível Conquistado!"}
                            </h2>

                            <hr className="nc-divider w-full" />

                            {/* XP Badge */}
                            <span className="nc-title text-sm font-bold tracking-wider text-amber-100 
                                bg-gradient-to-b from-amber-700 to-amber-900 
                                shadow-[0_2px_0_#451a03] rounded-full px-5 py-1.5">
                                ⚔ +{xpGanho} XP de Recompensa
                            </span>

                            {proximoNivel ? (
                                <>
                                    {/* Label próximo nível */}
                                    <span className="nc-title self-start text-[9px] tracking-[0.3em] 
                                        uppercase text-amber-800 font-semibold mt-1">
                                        ✦ Próxima Jornada — Nível {proximoNivel.nivel}
                                    </span>

                                    {/* Lista de desafios */}
                                    <div className="flex flex-col gap-2 w-full">
                                        {proximoNivel.desafios.map((d, i) => (
                                            <div
                                                key={d.id}
                                                className="flex items-center gap-3 px-3 py-2
                                                    bg-amber-900/10 border border-amber-800/20 rounded-sm"
                                            >
                                                <div className="nc-title flex-shrink-0 w-6 h-6 rounded-full 
                                                    bg-amber-900/15 border border-amber-800/30
                                                    flex items-center justify-content-center
                                                    text-[10px] font-bold text-amber-900
                                                    flex items-center justify-center">
                                                    {toRoman(i + 1)}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="nc-title text-[12px] font-semibold text-amber-950 m-0 mb-0.5">
                                                        {d.titulo}
                                                    </p>
                                                    <p className="nc-body italic text-[12px] text-amber-800 m-0 
                                                        truncate">
                                                        {d.descricao}
                                                    </p>
                                                </div>
                                                <span className="nc-title text-[11px] font-bold text-amber-800 whitespace-nowrap">
                                                    +{d.xp_recompensa} XP
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            ) : (
                                /* Fim do jogo */
                                <p className="nc-body text-center text-base italic text-amber-800 leading-relaxed px-2">
                                    "A tua jornada chegou ao fim, lendário aventureiro.<br/>
                                    O reino está em paz graças à tua sabedoria."
                                </p>
                            )}

                            <hr className="nc-divider w-full" />

                            <span className="text-amber-800/40 text-lg tracking-[8px]">— ✦ —</span>

                            {/* Botão principal */}
                            <button
                                onClick={handleContinuar}
                                className="nc-btn-primary w-80 h-10 rounded-full
                                    text-amber-100 text-sm font-bold"
                            >
                                {proximoNivel
                                    ? `⚔ Avançar para o Nível ${proximoNivel.nivel}`
                                    : "🏆 Ver o Meu Legado"
                                }
                            </button>

                            {/* Botão secundário */}
                            <button
                                onClick={handleClose}
                                className="nc-btn-secondary text-amber-700 text-sm"
                            >
                                Descansar na taverna
                            </button>

                        </div>
                    </div>
                </div>
            </div>
        </>,
        document.body
    );
}