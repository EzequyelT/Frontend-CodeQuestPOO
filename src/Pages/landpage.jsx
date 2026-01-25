import { useState, useEffect } from "react";
import HeaderLandPage from "../Components/Header/HeaderLandPage";
import logo from "../Assets/Section1.jpg";
import videoAbertura from "../Assets/Abertura.mp4";
import herois from "../Assets/Herois.jpg";
import evoluir from "../Assets/Evoluir.jpg";
import explorar from "../Assets/Explorar.jpg";
import aprender from "../Assets/Aprender.jpg";
import aurelia from "../Assets/Aurelia.png";
import bromm from "../Assets/Bromm.png";
import eldrin from "../Assets/Eldrin.png";
import lyra from "../Assets/Lyra.png";
import tharok from "../Assets/Tharok.png";
import vaelgrim from "../Assets/Vaelgrim.png";

const heroes = [
  {
    id: 1,
    name: "Aurelia",
    image: aurelia,
    title: "A Guardiã da Luz",
    description: "Mestra em encapsulamento, protege dados com barreiras mágicas.",
    stats: { power: 85, wisdom: 90, agility: 75 }
  },
  {
    id: 2,
    name: "Bromm",
    image: bromm,
    title: "O Guerreiro Inabalável",
    description: "Especialista em herança, carrega a força dos ancestrais.",
    stats: { power: 95, wisdom: 70, agility: 60 }
  },
  {
    id: 3,
    name: "Eldrin",
    image: eldrin,
    title: "O Sábio Ancião",
    description: "Mestre do polimorfismo, adapta-se a qualquer desafio.",
    stats: { power: 70, wisdom: 95, agility: 65 }
  },
  {
    id: 4,
    name: "Lyra",
    image: lyra,
    title: "A Arqueira Veloz",
    description: "Especialista em abstração, vê além do código superficial.",
    stats: { power: 75, wisdom: 80, agility: 95 }
  },
  {
    id: 5,
    name: "Tharok",
    image: tharok,
    title: "O Bárbaro Selvagem",
    description: "Domina classes e objetos com força bruta e precisão.",
    stats: { power: 90, wisdom: 65, agility: 70 }
  },
  {
    id: 6,
    name: "Vaelgrim",
    image: vaelgrim,
    title: "O Feiticeiro das Sombras",
    description: "Mestre em interfaces, conecta o mundo visível ao invisível.",
    stats: { power: 80, wisdom: 85, agility: 80 }
  }
];

export default function Landpage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flippedCards, setFlippedCards] = useState({});
  const [visibleElements, setVisibleElements] = useState({});
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      
      // Detecta elementos visíveis
      const elements = document.querySelectorAll('[data-scroll-reveal]');
      elements.forEach(el => {
        const rect = el.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight * 0.8;
        if (isVisible) {
          setVisibleElements(prev => ({
            ...prev,
            [el.id]: true
          }));
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 3 >= heroes.length ? 0 : prev + 3));
    setFlippedCards({});
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 3 < 0 ? Math.max(0, heroes.length - 3) : prev - 3));
    setFlippedCards({});
  };

  const toggleFlip = (id) => {
    setFlippedCards((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const visibleHeroes = heroes.slice(currentIndex, currentIndex + 3);

  return (
    <>
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&family=Pirata+One&display=swap');

        * {
          --scroll: ${scrollY}px;
        }

        .rpg-title {
          font-family: 'Pirata One', cursive;
          text-shadow: 
            3px 3px 0px #00ff88,
            6px 6px 0px rgba(0, 255, 136, 0.3),
            -1px -1px 0px rgba(0, 255, 136, 0.5);
          letter-spacing: 3px;
        }

        .rpg-heading {
          font-family: 'Cinzel', serif;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 2px;
          text-shadow: 
            2px 2px 0px rgba(0, 0, 0, 0.8),
            0px 0px 20px rgba(16, 185, 129, 0.5);
        }

        .rpg-border {
          border: 3px solid;
          border-image: linear-gradient(135deg, #10b981, #06b6d4) 1;
          box-shadow: 
            inset 0 0 20px rgba(16, 185, 129, 0.1),
            0 0 20px rgba(16, 185, 129, 0.2);
        }

        .scroll-reveal {
          opacity: 0;
          transform: translateY(40px);
          transition: all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .scroll-reveal.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .float-animation {
          animation: float 3s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        .glow-animation {
          animation: glow 2s ease-in-out infinite;
        }

        @keyframes glow {
          0%, 100% { 
            box-shadow: 0 0 10px rgba(16, 185, 129, 0.3),
                        inset 0 0 10px rgba(16, 185, 129, 0.1);
          }
          50% { 
            box-shadow: 0 0 30px rgba(16, 185, 129, 0.6),
                        inset 0 0 20px rgba(16, 185, 129, 0.3);
          }
        }

        .parallax {
          transform: translateY(calc(var(--scroll) * 0.5px));
        }

        .shine-effect {
          position: relative;
          overflow: hidden;
        }

        .shine-effect::after {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(
            45deg,
            transparent 20%,
            rgba(255, 255, 255, 0.1) 50%,
            transparent 80%
          );
          animation: shine 3s infinite;
        }

        @keyframes shine {
          0% { transform: translateX(-100%) translateY(-100%); }
          100% { transform: translateX(100%) translateY(100%); }
        }

        .pulse-border {
          animation: pulse-border 2s ease-in-out infinite;
        }

        @keyframes pulse-border {
          0%, 100% { 
            border-color: #10b981;
            box-shadow: 0 0 10px rgba(16, 185, 129, 0.3);
          }
          50% { 
            border-color: #06b6d4;
            box-shadow: 0 0 20px rgba(6, 182, 212, 0.6);
          }
        }

        .game-button {
          font-family: 'Cinzel', serif;
          position: relative;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 2px;
          border: 2px solid #10b981;
          overflow: hidden;
        }

        .game-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: #10b981;
          z-index: -1;
          transition: left 0.3s ease;
        }

        .game-button:hover::before {
          left: 0;
        }

        .card-border-glow {
          border: 2px solid #10b981;
          box-shadow: 
            0 0 10px rgba(16, 185, 129, 0.3),
            inset 0 0 10px rgba(16, 185, 129, 0.1);
        }

        .perspective-1000 {
          perspective: 1000px;
        }
        .transform-style-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
        
        .card-vintage {
          position: relative;
          background: linear-gradient(145deg, #3d2415 0%, #2a1810 100%);
          border-radius: 20px;
          border: 2px solid #10b981;
          box-shadow: 
            0 8px 16px rgba(0, 0, 0, 0.6),
            inset 0 1px 0 rgba(255, 255, 255, 0.1),
            0 0 20px rgba(16, 185, 129, 0.2);
        }
        
        .card-vintage::before {
          content: '';
          position: absolute;
          inset: 8px;
          border: 3px solid #5a3a2a;
          border-radius: 16px;
          pointer-events: none;
        }
        
        .card-corner {
          position: absolute;
          width: 40px;
          height: 40px;
          background: #2a1810;
          clip-path: polygon(0 0, 100% 0, 100% 100%);
        }
        
        .card-corner-tl {
          top: 0;
          left: 0;
          border-radius: 20px 0 0 0;
        }
        
        .card-corner-tr {
          top: 0;
          right: 0;
          border-radius: 0 20px 0 0;
          transform: rotate(90deg);
        }
        
        .card-corner-bl {
          bottom: 0;
          left: 0;
          border-radius: 0 0 0 20px;
          transform: rotate(-90deg);
        }
        
        .card-corner-br {
          bottom: 0;
          right: 0;
          border-radius: 0 0 20px 0;
          transform: rotate(180deg);
        }
        
        .hero-image-container {
          width: 100%;
          height: 280px;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          background: radial-gradient(circle, #1a1a1a 0%, #000000 100%);
        }
        
        .hero-image-container img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
        }
      `}</style>

      <div className=" w-full overflow-x-hidden">
        <HeaderLandPage />
      </div>

      {/* Seção de Vídeo */}
      <section className="relative w-full h-screen flex items-center justify-center overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          poster={logo}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ width: '100vw', height: '100vh', marginLeft: 'calc(-50vw + 50%)', marginTop: '0' }}
        >
          <source src={videoAbertura} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/10" style={{ width: '100vw', height: '100vh', marginLeft: 'calc(-50vw + 50%)' }}></div>
        
       
      </section>

      {/* Seção História */}
      <section className="relative w-full py-24 px-6 flex items-center justify-center bg-gradient-to-b from-black  to-black overflow-hidden">
        <div id="historia" data-scroll-reveal className={`scroll-reveal max-w-4xl mx-auto text-center ${visibleElements['historia'] ? 'visible' : ''}`}>
          <div className="flex items-center justify-center mb-12 gap-4">
            <div className="flex-1 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent"></div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-emerald-400 glow-animation"></div>
              <h2 className="rpg-heading text-5xl md:text-6xl text-emerald-400">
                História
              </h2>
              <div className="w-3 h-3 rounded-full bg-emerald-400 glow-animation"></div>
            </div>
            <div className="flex-1 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent"></div>
          </div>

          <div className="rpg-border p-8 bg-black/40 backdrop-blur-sm">
            <p className="text-gray-200 text-lg md:text-xl leading-relaxed font-light">
              Há muito tempo, num vale rodeado por grandes montanhas, existia um reino onde o
              conhecimento era a maior fonte de poder. Esse reino era protegido pelos
              <span className="text-emerald-400 font-bold"> Guardians do Código</span>, mestres da Programação Orientada a Objectos.
              <br /><br />
              Com o passar do tempo, o conhecimento foi sendo esquecido… e desse esquecimento
              nasceu o <span className="text-red-400 font-bold">Dragão do Caos</span>, uma criatura que se alimenta de erros e código mal
              estruturado.
              <br /><br />
              Agora, o reino está em perigo.
              <br />
              Novos heróis foram chamados.
              <br /><br />
              <span className="text-cyan-300 font-bold text-lg">Tu és um deles.</span>
              <br />
              Explora diferentes regiões, aprende os princípios da POO, enfrenta desafios e
              derrota o dragão para restaurar o conhecimento e salvar o reino.
            </p>
          </div>
        </div>
      </section>

      {/* Seção Imagem Heróis */}
      <section
        className="relative w-full h-screen bg-center bg-cover"
        style={{ backgroundImage: `url(${herois})` }}
      >
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 flex items-center justify-center h-full"></div>
      </section>

      {/* Seção Recursos de Jogo */}
      <section className="relative w-full py-24 px-6 bg-gradient-to-b from-black via-slate-950 to-black overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center mb-16 gap-4">
            <div className="flex-1 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent"></div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-cyan-400 glow-animation"></div>
              <h2 className="rpg-heading text-5xl md:text-6xl text-cyan-400">
                Recursos de Jogo
              </h2>
              <div className="w-3 h-3 rounded-full bg-cyan-400 glow-animation"></div>
            </div>
            <div className="flex-1 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent"></div>
          </div>

          <p className="text-gray-300 text-lg md:text-xl text-center mb-20 font-light">
            Um mundo cheio de <span className="text-emerald-400 font-bold">desafios</span>, <span className="text-cyan-300 font-bold">recompensas</span> e <span className="text-emerald-400 font-bold">conhecimento</span> à tua espera.
          </p>

          <div className="space-y-20">
            {/* Explorar */}
            <div id="explorar" data-scroll-reveal className={`scroll-reveal flex flex-col md:flex-row items-center gap-8 group ${visibleElements['explorar'] ? 'visible' : ''}`}>
              <div className="w-full md:w-1/2 overflow-hidden rounded-2xl shine-effect card-border-glow">
                <img
                  src={explorar}
                  alt="Explorar"
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
              </div>
              <div className="w-full md:w-1/2 space-y-4">
                <h3 className="rpg-heading text-4xl md:text-5xl text-emerald-400">
                  Explorar
                </h3>
                <p className="text-gray-300 text-lg leading-relaxed font-light">
                  Percorre diferentes <span className="text-cyan-300">mapas do reino</span>, desbloqueia novas áreas e descobre
                  conceitos fundamentais da Programação Orientada a Objectos à medida que
                  avanças na tua aventura épica.
                </p>
              </div>
            </div>

            {/* Evoluir */}
            <div id="evoluir" data-scroll-reveal className={`scroll-reveal flex flex-col md:flex-row-reverse items-center gap-8 group ${visibleElements['evoluir'] ? 'visible' : ''}`}>
              <div className="w-full md:w-1/2 overflow-hidden rounded-2xl shine-effect card-border-glow">
                <img
                  src={evoluir}
                  alt="Evoluir"
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
              </div>
              <div className="w-full md:w-1/2 space-y-4">
                <h3 className="rpg-heading text-4xl md:text-5xl text-cyan-400">
                  Evoluir
                </h3>
                <p className="text-gray-300 text-lg leading-relaxed font-light">
                  Ganha <span className="text-yellow-400">XP</span>, <span className="text-yellow-300">coins</span> e recompensas, melhora as tuas habilidades
                  e acompanha o teu progresso enquanto te tornas um verdadeiro
                  <span className="text-emerald-400 font-bold"> Guardião do Código</span>.
                </p>
              </div>
            </div>

            {/* Aprender */}
            <div id="aprender" data-scroll-reveal className={`scroll-reveal flex flex-col md:flex-row items-center gap-8 group ${visibleElements['aprender'] ? 'visible' : ''}`}>
              <div className="w-full md:w-1/2 overflow-hidden rounded-2xl shine-effect card-border-glow">
                <img
                  src={aprender}
                  alt="Aprender"
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
              </div>
              <div className="w-full md:w-1/2 space-y-4">
                <h3 className="rpg-heading text-4xl md:text-5xl text-emerald-400">
                  Aprender
                </h3>
                <p className="text-gray-300 text-lg leading-relaxed font-light">
                  Aprende <span className="text-cyan-300">Programação Orientada a Objectos (POO)</span> de forma prática,
                  divertida e descomplicada, com exercícios interactivos e desafios
                  que te ajudam a pensar como um verdadeiro programador.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Seção Call to Action */}
      <section className="relative w-full py-32 px-6 bg-gradient-to-b from-black via-emerald-950/30 to-black overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-emerald-500 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-cyan-500 rounded-full blur-3xl"></div>
        </div>

        <div id="cta" data-scroll-reveal className={`scroll-reveal relative z-10 max-w-4xl mx-auto text-center space-y-8 ${visibleElements['cta'] ? 'visible' : ''}`}>
          <h2 className="rpg-heading text-6xl md:text-7xl text-emerald-400">
            Explora este Mundo
          </h2>

          <p className="rpg-heading text-2xl md:text-3xl text-cyan-300">
            A tua jornada começa agora.
          </p>

          <p className="text-gray-300 text-xl md:text-2xl font-light">
            Estás pronto para te tornares um <span className="text-emerald-400 font-bold">Guardião do Código</span>?
          </p>

          <div className="pt-8">
            <button className="game-button px-12 py-5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-xl rounded-full hover:scale-110 hover:shadow-2xl hover:shadow-emerald-500/70 transition-all duration-300">
              <span className="relative z-10">Testa Agora</span>
            </button>
          </div>

          <div className="flex items-center justify-center gap-3 pt-8">
            <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse"></div>
            <div className="w-3 h-3 rounded-full bg-cyan-400 animate-pulse delay-75"></div>
            <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse delay-150"></div>
          </div>
        </div>
      </section>

      {/* Seção Escolha o Herói - Carousel */}
      <section className="relative w-full py-24 px-6 bg-gradient-to-b from-black via-gray-900 to-black">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center mb-8 gap-4">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-emerald-400 to-transparent"></div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
              <h2 className="text-4xl md:text-5xl font-bold text-white tracking-wider text-center">
                Escolhe o Teu Herói
              </h2>
              <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
            </div>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-emerald-400 to-transparent"></div>
          </div>

          <p className="text-gray-300 text-lg md:text-xl text-center mb-16 font-light">
            O mal avança e só os verdadeiros Guardiões do Código podem travá-lo. Escolhe o teu herói e começa a aventura.
          </p>

          <div className="relative">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {visibleHeroes.map((hero) => (
                <div
                  key={hero.id}
                  className="perspective-1000 h-[500px]"
                  onClick={() => toggleFlip(hero.id)}
                >
                  <div
                    className={`relative w-full h-full transition-transform duration-700 transform-style-3d cursor-pointer ${
                      flippedCards[hero.id] ? 'rotate-y-180' : ''
                    }`}
                  >
                    {/* Frente do Card */}
                    <div className="absolute inset-0 backface-hidden card-vintage overflow-hidden shadow-2xl">
                      {/* Cantos rasgados */}
                      <div className="card-corner card-corner-tl"></div>
                      <div className="card-corner card-corner-tr"></div>
                      <div className="card-corner card-corner-bl"></div>
                      <div className="card-corner card-corner-br"></div>
                      
                      {/* Imagem do herói */}
                      <div className="hero-image-container mt-4 mx-4 rounded-lg">
                        <img
                          src={hero.image}
                          alt={hero.name}
                        />
                      </div>
                      
                      {/* Nome do herói */}
                      <div className="p-6 text-center">
                        <h3 className="text-3xl font-bold text-white mb-2 tracking-wider" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
                          {hero.name}
                        </h3>
                        <p className="text-amber-400 text-sm font-semibold">
                          Clica para ver detalhes
                        </p>
                      </div>
                    </div>

                    {/* Verso do Card */}
                    <div className="absolute inset-0 backface-hidden rotate-y-180 card-vintage overflow-hidden shadow-2xl p-6 flex flex-col justify-between">
                      {/* Cantos rasgados */}
                      <div className="card-corner card-corner-tl"></div>
                      <div className="card-corner card-corner-tr"></div>
                      <div className="card-corner card-corner-bl"></div>
                      <div className="card-corner card-corner-br"></div>
                      
                      <div>
                        <h3 className="text-3xl font-bold text-white mb-2 text-center tracking-wider" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
                          {hero.name}
                        </h3>
                        <p className="text-amber-400 text-xl mb-4 text-center font-semibold">
                          {hero.title}
                        </p>
                        <p className="text-gray-200 text-base leading-relaxed mb-6 px-2">
                          {hero.description}
                        </p>
                      </div>

                      <div className="space-y-3 px-2">
                        <div className="flex justify-between items-center">
                          <span className="text-white font-semibold">Poder</span>
                          <div className="w-2/3 bg-gray-800 rounded-full h-3 border border-gray-600">
                            <div
                              className="bg-gradient-to-r from-red-600 to-red-500 h-full rounded-full transition-all duration-1000 shadow-lg"
                              style={{ width: `${hero.stats.power}%` }}
                            ></div>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-white font-semibold">Sabedoria</span>
                          <div className="w-2/3 bg-gray-800 rounded-full h-3 border border-gray-600">
                            <div
                              className="bg-gradient-to-r from-blue-600 to-blue-500 h-full rounded-full transition-all duration-1000 shadow-lg"
                              style={{ width: `${hero.stats.wisdom}%` }}
                            ></div>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-white font-semibold">Agilidade</span>
                          <div className="w-2/3 bg-gray-800 rounded-full h-3 border border-gray-600">
                            <div
                              className="bg-gradient-to-r from-green-600 to-green-500 h-full rounded-full transition-all duration-1000 shadow-lg"
                              style={{ width: `${hero.stats.agility}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>

                      <p className="text-amber-400 text-sm text-center mt-4 font-semibold">
                        Clica para voltar
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Navegação */}
            <div className="flex items-center justify-center gap-6">
              <button
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="px-8 py-3 bg-emerald-500 text-white font-bold rounded-full hover:bg-emerald-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
              >
                ← Anterior
              </button>

              <div className="flex gap-2">
                {Array.from({ length: Math.ceil(heroes.length / 3) }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-3 h-3 rounded-full transition-all ${
                      Math.floor(currentIndex / 3) === i
                        ? 'bg-emerald-400 w-8'
                        : 'bg-gray-600'
                    }`}
                  ></div>
                ))}
              </div>

              <button
                onClick={handleNext}
                disabled={currentIndex + 3 >= heroes.length}
                className="px-8 py-3 bg-emerald-500 text-white font-bold rounded-full hover:bg-emerald-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
              >
                Próximo →
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}