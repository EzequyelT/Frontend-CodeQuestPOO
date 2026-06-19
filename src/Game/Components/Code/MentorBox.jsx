import { useEffect, useState, useRef } from "react"
import { getMentorAluno, getReactionMentor } from "../../../Services/mentores/mentores"

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

function getImageUrl(path) {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  return `${BASE_URL}${path}`;
}

function getImageForStatus(mentor, status) {
  if (!mentor) return null;
  switch (status) {
    case "success": return getImageUrl(mentor.imagem_certo);
    case "error":   return getImageUrl(mentor.imagem_errado);
    case "typing":  return getImageUrl(mentor.imagem_duvida);
    default:        return getImageUrl(mentor.reacao_padrao ?? mentor.imagem);
  }
}

const STATUS_CONFIG = {
  idle:    { accent: "#4ade80", label: "Pronto" },
  typing:  { accent: "#60a5fa", label: "A pensar..." },
  error:   { accent: "#f87171", label: "Atenção!" },
  success: { accent: "#facc15", label: "Boa!" },
}

const DEFAULT_MESSAGES = {
  idle:    "Vamos começar! Escreve o teu código.",
  typing:  null,
  error:   "Algo não está certo. Revê o teu código!",
  success: "Perfeito! Passaste para o próximo desafio! 🎉",
}

export default function MentorBox({ status = "idle", messages = {}, aiFeedback = null }) {
  const [mentor, setMentor] = useState(null);
  const [mentorLoading, setMentorLoading] = useState(true);
  const bubbleRef = useRef(null);

  useEffect(() => {
    async function fetchMentor() {
      try {
        const mentorAluno = await getMentorAluno();
        if (!mentorAluno?.id) return;

        const reacoes = await getReactionMentor(mentorAluno.id);

        setMentor({ ...mentorAluno, ...reacoes });
      } catch (err) {
        console.error("Erro ao carregar mentor:", err);
      } finally {
        setMentorLoading(false);
      }
    }
    fetchMentor();
  }, []);

  useEffect(() => {
    const el = bubbleRef.current;
    if (!el) return;
    el.classList.remove("mentor-anim-pop", "mentor-anim-shake");
    void el.offsetWidth;
    el.classList.add(status === "error" ? "mentor-anim-shake" : "mentor-anim-pop");
  }, [status, aiFeedback]);

  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.idle;
  const heroImage = getImageForStatus(mentor, status);
  const mentorNome = mentor?.nome ?? "Mentor";

  const mergedMessages = {
    ...DEFAULT_MESSAGES,
    ...(messages?.phase || {}),
  };

  const text = (status === "error" && aiFeedback)
    ? aiFeedback
    : (mergedMessages[status] ?? DEFAULT_MESSAGES[status]);

  return (
    <>
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

      <div className="flex items-end gap-4 p-6 bg-gray-900 rounded-4xl border-4 border-gray-800 w-80 mt-6 mb-1">

        <div
          className="relative mb-6 flex-shrink-0 w-28 h-28 rounded-full overflow-hidden border-2 transition-all duration-300"
          style={{
            borderColor: cfg.accent,
            boxShadow: `0 0 0 4px ${cfg.accent}22`,
          }}
        >
          {mentorLoading ? (
            <div className="w-full h-full bg-gray-800 animate-pulse" />
          ) : heroImage ? (
            <img
              key={`${mentor?.id}-${status}`}
              src={heroImage}
              alt={`${mentorNome} ${status}`}
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="w-full h-full bg-gray-800 flex items-center justify-center text-xl font-black text-gray-500 drop-shadow-lg">
              {mentorNome[0]}
            </div>
          )}

          <div
            className="absolute bottom-1 right-2 w-3 h-3 rounded-full border-2 border-gray-900 transition-colors duration-300"
            style={{ background: cfg.accent }}
          />
        </div>

        <div className="flex flex-col gap-4 text-white font-bold flex-1 min-w-0">
          <p className="text-[11px] uppercase tracking-widest font-mono pl-1">
            {mentorNome} · Mentor
          </p>

          <div className="relative mb-6">
            <div className="absolute -left-2 bottom-3 w-0 h-0"
              style={{
                borderTop: "6px solid transparent",
                borderBottom: "6px solid transparent",
                borderRight: `8px solid ${cfg.accent}`,
              }}
            />
            <div className="absolute left-0 bottom-3 w-0 h-0"
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
                {cfg.label}
              </p>

              {status === "typing" ? (
                <div className="flex items-center gap-1 h-4">
                  {[0, 1, 2].map(i => (
                    <span key={i} className="mentor-dot block w-[10px] h-[10px] rounded-full"
                      style={{ background: cfg.accent }} />
                  ))}
                </div>
              ) : (
                <div
                  className="overflow-y-auto pr-1"
                  style={{
                    maxHeight: "100px",
                    scrollbarWidth: "thin",
                    scrollbarColor: `${cfg.accent}44 transparent`,
                  }}
                >
                  <p className="text-xs text-slate-300 font-mono leading-relaxed whitespace-pre-wrap break-words">
                    {text}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </>
  );
}