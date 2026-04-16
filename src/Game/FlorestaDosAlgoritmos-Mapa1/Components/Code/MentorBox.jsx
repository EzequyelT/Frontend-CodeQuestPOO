import Aflito from "../../../../assets/Heros/HeroesReaction/EldrinReactions/Aflito.png"
import Duvida from "../../../../assets/Heros/HeroesReaction/EldrinReactions/Duvida.png"
import Feliz from "../../../../assets/Heros/HeroesReaction/EldrinReactions/Feliz.png"
import Normal from "../../../../assets/Heros/HeroesReaction/EldrinReactions/Normal.png"
import { useEffect, useRef } from "react"

const CONFIG = {
  idle: { img: Normal, accent: "#4ade80", name: "Pronto", text: null },
  typing: { img: Duvida, accent: "#60a5fa", name: "A pensar...", text: null },
  error: { img: Duvida, accent: "#f87171", name: "Ops!", text: null },
  success: { img: Feliz, accent: "#facc15", name: "Boa!", text: null },
}

const DEFAULT_MESSAGES = {
  idle: "Vamos começar! Escreve o teu código.",
  typing: null, // usa dots animados
  error: "Algo não está certo. Revê o teu código!",
  success: "Perfeito! Passaste para a próxima fase! 🎉",
}

export default function MentorBox({ status = "idle", messages = {} }) {

  const bubbleRef = useRef(null)
  const cfg = CONFIG[status]
  const phaseMessages = messages?.phase || {}

  const mergedMessages = {
    ...DEFAULT_MESSAGES,
    ...phaseMessages,
  }

  const text = mergedMessages[status] ?? DEFAULT_MESSAGES[status]

  // re-anima o balão sempre que o status muda
  useEffect(() => {
    const el = bubbleRef.current
    if (!el) return
    el.classList.remove("mentor-anim-pop", "mentor-anim-shake")
    void el.offsetWidth // força reflow
    el.classList.add(status === "error" ? "mentor-anim-shake" : "mentor-anim-pop")
  }, [status])

  return (
    <>
      {/* estilos injetados uma vez */}
      <style>{`
        @keyframes mentorPop {
          0%   { transform: scale(0.85); opacity: 0; }
          70%  { transform: scale(1.04); }
          100% { transform: scale(1);    opacity: 1; }
        }
        @keyframes mentorShake {
          0%,100% { transform: translateX(0); }
          20%,60% { transform: translateX(-4px); }
          40%,80% { transform: translateX(4px); }
        }
        @keyframes mentorBounce {
          0%,60%,100% { transform: translateY(0); }
          30%         { transform: translateY(-5px); }
        }
        .mentor-anim-pop   { animation: mentorPop   0.35s cubic-bezier(0.34,1.56,0.64,1) forwards; }
        .mentor-anim-shake { animation: mentorShake 0.4s ease; }
        .mentor-dot { animation: mentorBounce 1.2s infinite; }
        .mentor-dot:nth-child(2) { animation-delay: 0.2s; }
        .mentor-dot:nth-child(3) { animation-delay: 0.4s; }
      `}</style>

      <div className="flex items-end gap-4 p-6 bg-gray-900 rounded-4xl border-4 border-gray-800 w-80 h-55 mt-6 mb-1">

        {/* Avatar com borda colorida */}
        <div
          className="relative mb-6 flex-shrink-0 w-25 h-25 rounded-full overflow-hidden border-2 transition-all duration-300"
          style={{
            borderColor: cfg.accent,
            boxShadow: `0 0 0 4px ${cfg.accent}22`,
          }}
        >
          <img
            src={cfg.img}
            alt={`Eldrin ${status}`}
            className="w-full h-full object-cover transition-all duration-400"
          />
          {/* dot de status */}
          <div
            className="absolute bottom-1 right-2  w-3 h-3 rounded-full border-2 border-gray-900 transition-colors duration-300"
            style={{ background: cfg.accent }}
          />
        </div>

        {/* Balão de fala */}
        <div className="flex flex-col gap-4 text-white font-bold flex-1">
          <p className="text-[11px] uppercase tracking-widesttext-white font-bold font-mono pl-1">
            Eldrin · Mentor
          </p>

          {/* Balão com pseudo-seta via div posicionada */}
          <div className="relative mb-6 animate-bounce">
            {/* Seta do balão */}
            <div
              className="absolute -left-2 bottom-3 w-0 h-0 transition-all duration-300"
              style={{
                borderTop: "6px solid transparent",
                borderBottom: "6px solid transparent",
                borderRight: `8px solid ${cfg.accent}`,
              }}
            />
            <div
              className="absolute left-0 bottom-3 w-0 h-0"
              style={{
                borderTop: "5px solid transparent",
                borderBottom: "5px solid transparent",
                borderRight: "7px solid #1e293b",
                zIndex: 1,
              }}
            />

            <div
              ref={bubbleRef}
              className="bg-[#1e293b] rounded-xl rounded-bl-sm p-3 border transition-colors duration-300"
              style={{ borderColor: cfg.accent }}
            >
              <p
                className="text-[10px] font-bold uppercase tracking-wider mb-1 font-mono transition-colors duration-300"
                style={{ color: cfg.accent }}
              >
                {cfg.name}
              </p>

              {status === "typing" ? (
                <div className="flex items-center gap-1 h-4">
                  {[0, 1, 2].map(i => (
                    <span
                      key={i}
                      className="mentor-dot block w-[10px] h-[10px] rounded-full"
                      style={{ background: cfg.accent }}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-300 font-mono leading-relaxed">
                   {text}
                </p>
              )}
            </div>
          </div>
        </div>

      </div>
    </>
  )
}