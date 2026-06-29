import { useState, useEffect } from "react";
import { FaGamepad, FaStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import HeaderLandingPage from "../Components/Header/HeaderLandingPage";
import logo from "../Assets/Section1.jpg";
import videoAbertura from "../Assets/landpage/Abertura.mp4";
import herois from "../Assets/landpage/Herois.png";
import evoluir from "../Assets/landpage/Evoluir.jpg";
import explorar from "../Assets/landpage/Explorar.jpg";
import aprender from "../Assets/landpage/Aprender.jpg";
import historiaBg from "../Assets/landpage/BgHistoria.png";
import FinalBg from "../Assets/landpage/FinalBg.png";
import Footer from "../Components/footer/FooterLandPage";
import { getAllMentores } from "../Services/mentores/mentores";
import { ChevronLeft, ChevronRight, Sparkles, RotateCcw } from "lucide-react";
import "../css/landingPage.css";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

function getImageUrl(path) {
    if (!path) return null;
    if (path.startsWith("http")) return path;
    return `${BASE_URL}${path}`;
}

const HERO_THEMES = {
    Aurelia:  { accent: "#f59e0b", label: "Guardiã da Luz",         via: "#d97706" },
    Bromm:    { accent: "#d97706", label: "Guerreiro Inabalável",    via: "#b45309" },
    Eldrin:   { accent: "#8b5cf6", label: "Sábio Ancião",           via: "#7c3aed" },
    Lyra:     { accent: "#10b981", label: "Arqueira Veloz",          via: "#059669" },
    Tharok:   { accent: "#ef4444", label: "Bárbaro Selvagem",        via: "#dc2626" },
    Vaelgrim: { accent: "#6366f1", label: "Cavaleiro Amaldiçoado",   via: "#4338ca" },
};

function getTheme(nome) {
    return HERO_THEMES[nome] ?? { accent: "#a3a3a3", label: "Guerreiro", via: "#737373" };
}

function HeroCard({ mentor, isCenter }) {
    const [flipped, setFlipped] = useState(false);
    const theme = getTheme(mentor.nome);

    return (
        <div
            className="relative flex-shrink-0 cursor-pointer select-none"
            style={{
                width: isCenter ? 280 : 220,
                height: isCenter ? 400 : 320,
                perspective: "1000px",
                transition: "width 0.4s ease, height 0.4s ease",
                zIndex: isCenter ? 10 : 1,
            }}
            onClick={() => setFlipped(f => !f)}
        >
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    position: "relative",
                    transformStyle: "preserve-3d",
                    transition: "transform 0.55s cubic-bezier(0.34,1.56,0.64,1)",
                    transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
                }}
            >
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        backfaceVisibility: "hidden",
                        WebkitBackfaceVisibility: "hidden",
                        borderRadius: 20,
                        overflow: "hidden",
                        border: `1.5px solid ${theme.accent}44`,
                        background: `linear-gradient(160deg, #0d0d0d 0%, #111 60%, ${theme.accent}10 100%)`,
                        boxShadow: isCenter
                            ? `0 0 40px -10px ${theme.accent}55, 0 20px 60px rgba(0,0,0,0.8)`
                            : `0 8px 32px rgba(0,0,0,0.6)`,
                    }}
                >
                    <div
                        style={{
                            position: "absolute",
                            bottom: 0,
                            left: "50%",
                            transform: "translateX(-50%)",
                            width: "70%",
                            height: 80,
                            borderRadius: "50%",
                            background: theme.accent,
                            filter: "blur(30px)",
                            opacity: isCenter ? 0.25 : 0.12,
                            pointerEvents: "none",
                        }}
                    />

                    <img
                        src={getImageUrl(mentor.imagem)}
                        alt={mentor.nome}
                        style={{
                            width: "100%",
                            height: "80%",
                            objectFit: "cover",
                            objectPosition: "top",
                            display: "block",
                            filter: isCenter ? "brightness(1)" : "brightness(0.7) saturate(0.7)",
                            transition: "filter 0.4s ease",
                        }}
                    />

                    <div style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        padding: "12px 16px 14px",
                        background: `linear-gradient(to top, #050505 0%, rgba(5,5,5,0.95) 60%, transparent 100%)`,
                    }}>
                        <span style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 4,
                            fontSize: 9,
                            fontWeight: 800,
                            textTransform: "uppercase",
                            letterSpacing: "0.1em",
                            color: theme.accent,
                            background: theme.accent + "18",
                            border: `1px solid ${theme.accent}33`,
                            borderRadius: 20,
                            padding: "2px 8px",
                            marginBottom: 4,
                        }}>
                            <Sparkles size={8} />
                            {theme.label}
                        </span>

                        <p style={{
                            margin: 0,
                            fontSize: isCenter ? 18 : 14,
                            fontWeight: 900,
                            color: "#fff",
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                            background: `linear-gradient(135deg, #fff 30%, ${theme.accent} 100%)`,
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            transition: "font-size 0.4s ease",
                        }}>
                            {mentor.nome}
                        </p>
                    </div>

                    <div style={{
                        position: "absolute",
                        top: 12,
                        right: 12,
                        width: 28,
                        height: 28,
                        borderRadius: 8,
                        background: "rgba(0,0,0,0.6)",
                        border: `1px solid ${theme.accent}33`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}>
                        <RotateCcw size={12} color={theme.accent} />
                    </div>
                </div>

                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        backfaceVisibility: "hidden",
                        WebkitBackfaceVisibility: "hidden",
                        transform: "rotateY(180deg)",
                        borderRadius: 20,
                        overflow: "hidden",
                        border: `1.5px solid ${theme.accent}55`,
                        background: `linear-gradient(160deg, #0a0a0a 0%, #0f0f0f 50%, ${theme.accent}12 100%)`,
                        boxShadow: `0 0 40px -10px ${theme.accent}55, 0 20px 60px rgba(0,0,0,0.8)`,
                        padding: "24px 20px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                    }}
                >
                    <div style={{
                        position: "absolute",
                        top: 0, left: 20, right: 20, height: 1,
                        background: `linear-gradient(90deg, transparent, ${theme.accent}, transparent)`,
                    }} />

                    <div>
                        <span style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 4,
                            fontSize: 9,
                            fontWeight: 800,
                            textTransform: "uppercase",
                            letterSpacing: "0.1em",
                            color: theme.accent,
                            background: theme.accent + "18",
                            border: `1px solid ${theme.accent}33`,
                            borderRadius: 20,
                            padding: "2px 8px",
                            marginBottom: 10,
                        }}>
                            <Sparkles size={8} />
                            {theme.label}
                        </span>

                        <h3 style={{
                            margin: "0 0 6px",
                            fontSize: 22,
                            fontWeight: 900,
                            textTransform: "uppercase",
                            letterSpacing: "0.04em",
                            background: `linear-gradient(135deg, #fff 30%, ${theme.accent} 100%)`,
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                        }}>
                            {mentor.nome}
                        </h3>

                        <div style={{
                            width: 32, height: 2, borderRadius: 1,
                            background: `linear-gradient(to right, ${theme.accent}, transparent)`,
                            marginBottom: 14,
                        }} />

                        <p style={{
                            margin: 0,
                            fontSize: 12,
                            color: "#a3a3a3",
                            lineHeight: 1.7,
                        }}>
                            {mentor.descricao}
                        </p>
                    </div>

                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        justifyContent: "center",
                        marginTop: 16,
                        paddingTop: 12,
                        borderTop: `1px solid ${theme.accent}22`,
                    }}>
                        <RotateCcw size={11} color={theme.accent} />
                        <span style={{ fontSize: 10, color: theme.accent + "aa", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                            Voltar
                        </span>
                    </div>

                    {/* Bottom accent line */}
                    <div style={{
                        position: "absolute",
                        bottom: 0, left: 20, right: 20, height: 1,
                        background: `linear-gradient(90deg, transparent, ${theme.accent}, transparent)`,
                    }} />
                </div>
            </div>
        </div>
    );
}


function MentorCarousel({ mentores }) {
    const [index, setIndex] = useState(0);

    function prev() {
        setIndex(i => (i - 1 + mentores.length) % mentores.length);
    }
    function next() {
        setIndex(i => (i + 1) % mentores.length);
    }

    if (!mentores.length) return null;

    const slots = [-1, 0, 1].map(offset => {
        const idx = (index + offset + mentores.length) % mentores.length;
        return { mentor: mentores[idx], offset };
    });

    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 32 }}>
            <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 20,
                padding: "20px 0",
            }}>
                <button
                    onClick={prev}
                    style={{
                        width: 44, height: 44, borderRadius: 14,
                        background: "rgba(10,10,10,0.8)",
                        border: "1px solid #2a2a2a",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        cursor: "pointer", color: "#737373",
                        transition: "all 0.2s ease",
                        flexShrink: 0,
                    }}
                    onMouseEnter={e => { e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderColor = "#525252"; }}
                    onMouseLeave={e => { e.currentTarget.style.color = "#737373"; e.currentTarget.style.borderColor = "#2a2a2a"; }}
                >
                    <ChevronLeft size={18} />
                </button>

                <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                }}>
                    {slots.map(({ mentor, offset }) => (
                        <div
                            key={mentor.id}
                            onClick={() => offset !== 0 && (offset === -1 ? prev() : next())}
                            style={{
                                opacity: offset === 0 ? 1 : 0.45,
                                transform: offset === 0 ? "translateY(0) scale(1)" : `translateY(20px) scale(0.88)`,
                                transition: "all 0.4s cubic-bezier(0.34,1.56,0.64,1)",
                                cursor: offset !== 0 ? "pointer" : "default",
                            }}
                        >
                            <HeroCard mentor={mentor} isCenter={offset === 0} />
                        </div>
                    ))}
                </div>

                <button
                    onClick={next}
                    style={{
                        width: 44, height: 44, borderRadius: 14,
                        background: "rgba(10,10,10,0.8)",
                        border: "1px solid #2a2a2a",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        cursor: "pointer", color: "#737373",
                        transition: "all 0.2s ease",
                        flexShrink: 0,
                    }}
                    onMouseEnter={e => { e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderColor = "#525252"; }}
                    onMouseLeave={e => { e.currentTarget.style.color = "#737373"; e.currentTarget.style.borderColor = "#2a2a2a"; }}
                >
                    <ChevronRight size={18} />
                </button>
            </div>

            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                {mentores.map((m, i) => {
                    const theme = getTheme(m.nome);
                    const active = i === index;
                    return (
                        <button
                            key={m.id}
                            onClick={() => setIndex(i)}
                            style={{
                                width: active ? 24 : 7,
                                height: 7,
                                borderRadius: 4,
                                border: "none",
                                cursor: "pointer",
                                background: active ? theme.accent : "#2a2a2a",
                                transition: "all 0.3s ease",
                                padding: 0,
                            }}
                        />
                    );
                })}
            </div>

            <p style={{
                fontSize: 12,
                color: "#525252",
                textTransform: "uppercase",
                letterSpacing: "0.15em",
                fontWeight: 700,
                margin: 0,
            }}>
                {mentores[index]?.nome} · {getTheme(mentores[index]?.nome).label}
            </p>
        </div>
    );
}

export default function Landingpage() {
    const [visibleElements, setVisibleElements] = useState({});
    const [mentores, setMentores] = useState([]);
    const [mentoresLoading, setMentoresLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            const y = window.scrollY;
            document.documentElement.style.setProperty("--scroll", `${y}px`);
            const elements = document.querySelectorAll("[data-scroll-reveal]");
            elements.forEach(el => {
                const rect = el.getBoundingClientRect();
                if (rect.top < window.innerHeight * 0.85) {
                    setVisibleElements(prev => ({ ...prev, [el.id]: true }));
                }
            });
        };
        window.addEventListener("scroll", handleScroll);
        handleScroll();
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        getAllMentores()
            .then(data => setMentores(Array.isArray(data) ? data : []))
            .catch(err => console.error("Erro ao buscar mentores:", err))
            .finally(() => setMentoresLoading(false));
    }, []);

    return (
        <>
            <div className="w-full overflow-x-hidden">
                <HeaderLandingPage />
            </div>

            <section id="video" className="relative w-full py-115 px-135 flex items-center justify-center overflow-hidden" style={{ minHeight: "90vh" }}>
                <video autoPlay loop muted playsInline poster={logo} className="absolute inset-0 w-full h-full object-cover">
                    <source src={videoAbertura} type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-black/20" />
            </section>

            <section id="historia" className="relative w-full py-20 px-8 flex items-center justify-center bg-black overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b bg-gradient-to-t from-black/50 via-black/5 to-black" />
                <div
                    className="relative w-full max-w-7xl mx-auto"
                    style={{
                        backgroundImage: `url(${historiaBg})`,
                        backgroundSize: "100% 100%",
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "center",
                        minHeight: "1000px",
                        padding: "10px 20px",
                    }}
                >
                    <div id="historia" data-scroll-reveal className={`scroll-reveal text-center relative z-10 ${visibleElements["historia"] ? "visible" : ""}`}>
                        <div className="mb-8">
                            <h2 className="rpg-heading text-6xl md:text-7xl text-yellow-400 text-center animate-pulse mt-20">
                                História
                            </h2>
                        </div>
                        <div className="relative z-10 max-w-3xl ml-60 mt-15">
                            <p className="rpg-text text-black text-sm md:text-base leading-relaxed font-light">
                                <span className="font-serif font-semibold text-2xl">H</span>
                                á muito tempo, num vale rodeado por grandes montanhas, existia um reino onde o
                                conhecimento era a maior fonte de poder. Esse reino era protegido pelos
                                <span className="text-black font-bold"> Guardians do Código</span>, mestres da Programação Orientada a Objectos.
                                <br /><br />
                                Com o passar do tempo, o conhecimento foi sendo esquecido… e desse esquecimento
                                nasceu o <span className="text-red-600 font-semibold">Dragão do Caos</span>, uma criatura que se alimenta de erros e código mal estruturado.
                                <br /><br />
                                <span className="inline-block px-3 py-1.5 bg-red-100 border-l-4 border-red-600 rounded text-xs md:text-sm">
                                    Agora, o reino está em perigo.
                                </span>
                                <br />
                                <span className="inline-block px-3 py-1.5 bg-amber-100 border-l-4 border-amber-600 rounded mt-1 text-xs md:text-sm">
                                    Novos heróis foram chamados.
                                </span>
                                <br /><br />
                                <span className="text-cyan-700 font-semibold text-sm md:text-base inline-block px-4 py-2 bg-cyan-100 rounded-lg border border-cyan-600 shadow">
                                    ⚡ Tu és um deles. ⚡
                                </span>
                                <br /><br />
                                Explora diferentes regiões, aprende os princípios da POO, enfrenta desafios e
                                derrota o dragão para restaurar o conhecimento e salvar o reino.
                            </p>
                            <div className="mt-4 pt-4 border-t border-amber-600/30">
                                <p className="text-black font-bold italic text-sm md:text-base font-medium">
                                    "O código bem estruturado é a espada que derrota o caos"
                                </p>
                                <p className="text-gray-800 text-xs mt-1">— Antigo provérbio dos Guardians</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section
                className="relative w-full py-80 px-20 overflow-hidden"
                style={{
                    backgroundImage: `url(${herois})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                }}
            >
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/30" />
                <div className="relative z-10 flex items-center justify-center min-h-screen" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/5 to-black" />
            </section>

            <section id="recursos" className="relative w-full py-24 px-6 bg-gradient-to-b from-black via-slate-950 to-black overflow-hidden">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-center mb-16 gap-4">
                        <div className="flex-1 h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                        <div className="flex items-center gap-3">
                            <FaStar className="text-emerald-400 text-2xl animate-pulse" />
                            <h2 className="rpg-heading text-5xl md:text-6xl text-white">Recursos de Jogo</h2>
                            <FaStar className="text-emerald-400 text-2xl animate-pulse" />
                        </div>
                        <div className="flex-1 h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                    </div>
                    <p className="rpg-text text-gray-300 text-lg md:text-xl text-center mb-20 font-light">
                        Um mundo cheio de <span className="text-white font-bold">desafios</span>, <span className="text-emerald-400 font-bold">recompensas</span> e <span className="text-white font-bold">conhecimento</span> à tua espera.
                    </p>
                    <div className="space-y-20">
                        {[
                            { id: "explorar", src: explorar, title: "Explorar", reverse: false, desc: <>Percorre diferentes <span className="text-white font-semibold">mapas do reino</span>, desbloqueia novas áreas e descobre conceitos fundamentais da Programação Orientada a Objectos à medida que avanças na tua aventura épica.</>, tags: ["Mapas Únicos", "Desafios POO"], tagColors: ["emerald", "white"] },
                            { id: "evoluir",  src: evoluir,  title: "Evoluir",  reverse: true,  desc: <>Ganha <span className="text-yellow-400 font-semibold">XP</span>, <span className="text-yellow-300 font-semibold">coins</span> e recompensas, melhora as tuas habilidades e acompanha o teu progresso enquanto te tornas um verdadeiro <span className="text-white font-bold">Guardião do Código</span>.</>, tags: ["Sistema XP", "Recompensas"], tagColors: ["yellow", "white"] },
                            { id: "aprender", src: aprender, title: "Aprender", reverse: false, desc: <>Aprende <span className="text-white font-semibold">Programação Orientada a Objectos (POO)</span> de forma prática, divertida e descomplicada, com exercícios interactivos e desafios que te ajudam a pensar como um verdadeiro programador.</>, tags: ["POO Prática", "Interativo"], tagColors: ["emerald", "white"] },
                        ].map(({ id, src, title, reverse, desc, tags, tagColors }) => (
                            <div key={id} id={id} data-scroll-reveal className={`scroll-reveal flex flex-col ${reverse ? "md:flex-row-reverse" : "md:flex-row"} items-center gap-8 group ${visibleElements[id] ? "visible" : ""}`}>
                                <div className="w-full md:w-1/2 overflow-hidden rounded-2xl shine-effect card-border-glow-white">
                                    <img src={src} alt={title} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
                                </div>
                                <div className="w-full md:w-1/2 space-y-6">
                                    <div className={`flex items-center gap-3 ${reverse ? "justify-end md:justify-start" : ""}`}>
                                        {!reverse && <div className="w-1 h-12 bg-gradient-to-b from-emerald-400 to-white" />}
                                        <h3 className="rpg-heading text-4xl md:text-5xl text-white">{title}</h3>
                                        {reverse && <div className="w-1 h-12 bg-gradient-to-b from-white to-emerald-400" />}
                                    </div>
                                    <p className={`rpg-text text-gray-300 text-lg leading-relaxed font-light ${reverse ? "md:text-right" : ""}`}>{desc}</p>
                                    <div className={`flex gap-3 pt-4 ${reverse ? "justify-end md:justify-start" : ""}`}>
                                        {tags.map((tag, ti) => (
                                            <span key={ti} className={`px-4 py-2 rounded-full text-sm font-semibold ${tagColors[ti] === "emerald" ? "bg-emerald-500/20 border border-emerald-500/50 text-emerald-400" : tagColors[ti] === "yellow" ? "bg-yellow-500/20 border border-yellow-500/50 text-yellow-400" : "bg-white/10 border border-white/30 text-white"}`}>
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section
                className="relative w-full py-70 px-60 overflow-hidden"
                style={{
                    backgroundImage: `url(${FinalBg})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                }}
            >
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-black/4 to-black" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/5 to-black" />
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-emerald-500 rounded-full blur-3xl" />
                    <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-white rounded-full blur-3xl" />
                </div>
                <div id="cta" data-scroll-reveal className={`scroll-reveal relative z-10 max-w-4xl mx-auto text-center space-y-8 ${visibleElements["cta"] ? "visible" : ""}`}>
                    <h2 className="rpg-heading text-6xl md:text-7xl text-white float-animation drop-shadow-2xl">Explora este Mundo</h2>
                    <p className="rpg-heading text-2xl md:text-3xl text-emerald-400">A tua jornada começa agora.</p>
                    <p className="rpg-text text-gray-200 text-xl md:text-2xl font-light">
                        Estás pronto para te tornares um <span className="text-white font-bold">Guardião do Código</span>?
                    </p>
                    <div className="pt-8">
                        <button
                            onClick={() => navigate("/login")}
                            className="game-button px-12 py-5 bg-gradient-to-r from-white via-gray-100 to-white text-black text-xl font-bold rounded-full hover:scale-110 hover:shadow-2xl hover:shadow-white/70 transition-all duration-300 border-2 border-emerald-400"
                        >
                            <span className="relative z-10 flex items-center justify-center gap-3">
                                <FaGamepad className="text-2xl" />
                                Comece essa aventura agora!
                            </span>
                        </button>
                    </div>
                    <div className="flex items-center justify-center gap-3 pt-8">
                        <div className="w-3 h-3 rounded-full bg-white animate-pulse" />
                        <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse delay-75" />
                        <div className="w-3 h-3 rounded-full bg-white animate-pulse delay-150" />
                    </div>
                </div>
            </section>

            <section id="herois" className="relative w-full py-24 px-6 bg-gradient-to-b from-black via-gray-900 to-black overflow-hidden">

                <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 60% 40% at 50% 50%, rgba(139,92,246,0.04) 0%, transparent 70%)" }} />

                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="flex items-center justify-center mb-8 gap-4">
                        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-white" style={{ boxShadow: "0 0 8px #fff" }} />
                            <h2 className="rpg-heading text-4xl md:text-5xl text-white tracking-wider text-center">
                                Os Guardiões
                            </h2>
                            <div className="w-2 h-2 rounded-full bg-white" style={{ boxShadow: "0 0 8px #fff" }} />
                        </div>
                        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                    </div>

                    <p className="rpg-text text-gray-400 text-lg md:text-xl text-center mb-16 font-light max-w-2xl mx-auto">
                        Cada guardião tem a sua especialidade. Escolhe o teu mentor e parte para a batalha contra o
                        <span className="text-red-500 font-semibold"> Dragão do Caos</span>.
                    </p>

                    {mentoresLoading ? (
                        <div className="flex justify-center py-20">
                            <div style={{ width: 32, height: 32, borderRadius: "50%", border: "2px solid #2a2a2a", borderTop: "2px solid #a3a3a3", animation: "spin 1s linear infinite" }} />
                        </div>
                    ) : (
                        <MentorCarousel mentores={mentores} />
                    )}

                    <p className="text-center text-neutral-700 text-xs mt-8 tracking-widest uppercase font-bold">
                        Clica na carta para ver os detalhes do guardião
                    </p>
                </div>
            </section>

            <style>{`
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            `}</style>

            <Footer />
        </>
    );
}