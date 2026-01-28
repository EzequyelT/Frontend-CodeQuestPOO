import { useState, useEffect } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import HeaderLandPage from "../Components/Header/HeaderLandPage";
import logo from "../Assets/Section1.jpg";
import videoAbertura from "../Assets/Abertura.mp4";
import herois from "../Assets/Herois.png";
import evoluir from "../Assets/Evoluir.jpg";
import explorar from "../Assets/Explorar.jpg";
import aprender from "../Assets/Aprender.jpg";
import bgSection4 from "../Assets/bgSection4.jpg";
import heroes from "../data/heroesData";
import historiaBg from "../Assets/BgHistoria.png";
import "../css/landpage.css";

export default function Landpage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flippedCards, setFlippedCards] = useState({});
  const [visibleElements, setVisibleElements] = useState({});
  const [scrollY, setScrollY] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setScrollY(y);
      document.documentElement.style.setProperty('--scroll', `${y}px`);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll reveal effect
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
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

  // Auto-play carousel
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const next = prev + 3;
        return next >= heroes.length ? 0 : next;
      });
      setFlippedCards({});
    }, 5000); // Muda a cada 5 segundos

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const handleNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 3 >= heroes.length ? 0 : prev + 3));
    setFlippedCards({});
  };

  const handlePrev = () => {
    setIsAutoPlaying(false);
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

      <div className="w-full overflow-x-hidden">
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
        <div className="absolute inset-0 bg-black/15" style={{ width: '100vw', height: '100vh', marginLeft: 'calc(-50vw + 50%)' }}></div>

      </section>


      <section className="relative w-full py-18 px-8 flex items-center justify-center bg-black overflow-hidden">
        {/* Background com pergaminho */}
        <div className="absolute inset-0 bg-gradient-to-b bg-gradient-to-t from-black/50 via-black/5 to-black" />
        <div className="particles">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="particle"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 10}s`,
                animationDuration: `${15 + Math.random() * 10}s`
              }}
            />
          ))}
        </div>
        <div
          className="relative w-full max-w-7xl mx-auto"
          style={{
            backgroundImage: `url(${historiaBg})`,
            backgroundSize: '100% 100%',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            minHeight: '1000px',
            padding: '100px 120px'
          }}
        >
          <div
            id="historia"
            data-scroll-reveal
            className={`scroll-reveal text-center relative z-10 ${visibleElements['historia'] ? 'visible' : ''}`}
          >
            {/* Título simples */}
            <div className="mb-8">
              <h2 className="rpg-heading text-6xl md:text-7xl  text-yellow-400 text-center animate-pulse">
                História
              </h2>
            </div>

            {/* Conteúdo da história */}
            <div className="relative z-10 max-w-3xl ml-33 mt-15">
              <p className="rpg-text text-black text-sm md:text-base leading-relaxed font-light">
                <span className="font-serif font-semibold">
                  H
                </span>
                á muito tempo, num vale rodeado por grandes montanhas, existia um reino onde o
                conhecimento era a maior fonte de poder. Esse reino era protegido pelos
                <span className="text-black font-bold"> Guardians do Código</span>, mestres da Programação Orientada a Objectos.
                <br /><br />

                Com o passar do tempo, o conhecimento foi sendo esquecido… e desse esquecimento
                nasceu o <span className="text-red-600 font-semibold">Dragão do Caos</span>, uma criatura que se alimenta de erros e código mal
                estruturado.
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

              {/* Citação decorativa */}
              <div className="mt-4 pt-4 border-t border-amber-600/30">
                <p className="text-black font-bold italic text-sm md:text-base font-medium">
                  "O código bem estruturado é a espada que derrota o caos"
                </p>
                <p className="text-gray-800 text-xs mt-1">
                  — Antigo provérbio dos Guardians
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Seção Imagem Heróis */}
      <section
        className="relative w-full py-40 px-10 overflow-hidden"
        style={{
          backgroundImage: `url(${herois})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/30" />

        {/* Conteúdo */}
        <div className="relative z-10 flex items-center justify-center min-h-screen">

        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/5 to-black" />
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

          <p className="rpg-text text-gray-300 text-lg md:text-xl text-center mb-20 font-light">
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
              <div className="w-full md:w-1/2 space-y-4 ">
                <h3 className="rpg-heading text-4xl md:text-5xl text-emerald-400 ">
                  Explorar
                </h3>
                <p className="rpg-text text-gray-300 text-lg leading-relaxed font-light">
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
                <p className="rpg-text text-gray-300 text-lg leading-relaxed font-light">
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
                <p className="rpg-text text-gray-300 text-lg leading-relaxed font-light">
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
      <section
        className="relative w-full py-80 px-10 overflow-hidden"
        style={{
          backgroundImage: `url(${bgSection4})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/*gradiante para o top e bottom */}
        <div className="absolute inset-0 bg-gradient-to-b bg-gradient-to-t from-black/50 via-black/5 to-black" />
        <div className="absolute inset-0 bg-gradient-to-b bg-gradient-to-b from-black/50 via-black/5 to-black" />


        {/* Efeito de brilho adicional */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-emerald-500 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-cyan-500 rounded-full blur-3xl"></div>
        </div>

        <div id="cta" data-scroll-reveal className={`scroll-reveal relative z-10 max-w-4xl mx-auto text-center space-y-8 ${visibleElements['cta'] ? 'visible' : ''}`}>
          <h2 className="rpg-heading text-6xl md:text-7xl text-emerald-400 float-animation">
            Explora este Mundo
          </h2>

          <p className="rpg-heading text-2xl md:text-3xl text-cyan-300">
            A tua jornada começa agora.
          </p>

          <p className="rpg-text text-gray-300 text-xl md:text-2xl font-light">
            Estás pronto para te tornares um <span className="text-emerald-400 font-bold">Guardião do Código</span>?
          </p>

          <div className="pt-8">
            <button className="game-button px-12 py-5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-xl rounded-full hover:scale-110 hover:shadow-2xl hover:shadow-emerald-500/70 transition-all duration-300">
              <span className="relative z-10">Comece essa aventura agora!</span>
            </button>
          </div>

          <div className="flex items-center justify-center gap-3 pt-8">
            <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse"></div>
            <div className="w-3 h-3 rounded-full bg-cyan-400 animate-pulse delay-75"></div>
            <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse delay-150"></div>
          </div>
        </div>
      </section>

      {/* Seção Escolha o Herói - Carousel Automático */}
      <section className="relative w-full py-24 px-6 bg-gradient-to-b from-black via-gray-900 to-black overflow-hidden">
        <div className="particles">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="particle"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 10}s`,
                animationDuration: `${15 + Math.random() * 10}s`
              }}
            />
          ))}
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex items-center justify-center mb-8 gap-4">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-emerald-400 to-transparent"></div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-400 glow-animation"></div>
              <h2 className="rpg-heading text-4xl md:text-5xl text-white tracking-wider text-center">
                Escolhe o Teu Herói
              </h2>
              <div className="w-2 h-2 rounded-full bg-emerald-400 glow-animation"></div>
            </div>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-emerald-400 to-transparent"></div>
          </div>

          <p className="rpg-text text-gray-300 text-lg md:text-xl text-center mb-16 font-light">
            O mal avança e só os verdadeiros <span className="text-emerald-400 font-bold">Guardiões do Código</span> podem travá-lo. Escolhe o teu herói e começa a aventura.
          </p>

          <div className="relative">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {visibleHeroes.map((hero) => (
                <div
                  key={hero.id}
                  className="card-flip-container"
                  onClick={() => toggleFlip(hero.id)}
                >
                  <div className={`card-flip-inner ${flippedCards[hero.id] ? 'flipped' : ''}`}>
                    {/* Frente do Card */}
                    <div className="card-face card-vintage cursor-pointer hover:shadow-2xl hover:shadow-emerald-500/20 transition-all duration-300">
                      {/* Cantos decorativos */}
                      <div className="card-corner card-corner-tl"></div>
                      <div className="card-corner card-corner-tr"></div>
                      <div className="card-corner card-corner-bl"></div>
                      <div className="card-corner card-corner-br"></div>

                      {/* Imagem do herói */}
                      <div className="hero-image-container">
                        <img
                          src={hero.image}
                          alt={hero.name}
                        />
                      </div>

                      {/* Nome do herói */}
                      <div className="p-6 text-center">
                        <h3 className="rpg-heading text-3xl text-white mb-2 tracking-wider" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
                          {hero.name}
                        </h3>
                        <p className="text-amber-400 text-sm font-semibold tracking-wide">
                          ⚔️ Clica para ver detalhes ⚔️
                        </p>
                      </div>
                    </div>

                    {/* Verso do Card */}
                    <div className="card-face card-back card-vintage cursor-pointer">
                      {/* Cantos decorativos */}
                      <div className="card-corner card-corner-tl"></div>
                      <div className="card-corner card-corner-tr"></div>
                      <div className="card-corner card-corner-bl"></div>
                      <div className="card-corner card-corner-br"></div>

                      <div className="p-6 h-full flex flex-col justify-between">
                        <div>
                          <h3 className="rpg-heading text-3xl text-white mb-2 text-center tracking-wider" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
                            {hero.name}
                          </h3>
                          <p className="text-amber-400 text-xl mb-4 text-center font-semibold">
                            {hero.title}
                          </p>
                          <p className="rpg-text text-gray-200 text-base leading-relaxed mb-6 px-2">
                            {hero.description}
                          </p>
                        </div>

                        <div className="space-y-3 px-2">
                          <div className="flex justify-between items-center">
                            <span className="text-white font-semibold">⚔️ Poder</span>
                            <div className="w-2/3 bg-gray-800 rounded-full h-3 border border-gray-600">
                              <div
                                className="stat-bar bg-gradient-to-r from-red-600 to-red-500 h-full rounded-full shadow-lg"
                                style={{ width: `${hero.stats.power}%` }}
                              ></div>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-white font-semibold">📚 Sabedoria</span>
                            <div className="w-2/3 bg-gray-800 rounded-full h-3 border border-gray-600">
                              <div
                                className="stat-bar bg-gradient-to-r from-blue-600 to-blue-500 h-full rounded-full shadow-lg"
                                style={{ width: `${hero.stats.wisdom}%` }}
                              ></div>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-white font-semibold">⚡ Agilidade</span>
                            <div className="w-2/3 bg-gray-800 rounded-full h-3 border border-gray-600">
                              <div
                                className="stat-bar bg-gradient-to-r from-green-600 to-green-500 h-full rounded-full shadow-lg"
                                style={{ width: `${hero.stats.agility}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>

                        <p className="text-amber-400 text-sm text-center mt-4 font-semibold">
                          🔄 Clica para voltar
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Navegação e indicadores */}
            <div className="flex items-center justify-center gap-6">
              {/* Botão Esquerda */}
              <button
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="
                  w-14 h-14
                  flex items-center justify-center
                  bg-gradient-to-br from-emerald-400 to-emerald-600
                  text-white
                  rounded-full
                  border-2 border-emerald-300
                  shadow-lg shadow-emerald-500/50
                  transition-all duration-300
                  hover:scale-110
                  hover:shadow-2xl
                  hover:shadow-emerald-500/70
                  active:scale-95
                  disabled:opacity-30
                  disabled:cursor-not-allowed
                  disabled:hover:scale-100
                "
              >
                <FaArrowLeft size={20} />
              </button>

              {/* Indicadores */}
              <div className="flex items-center gap-3">
                {Array.from({ length: Math.ceil(heroes.length / 3) }).map((_, i) => (
                  <div
                    key={i}
                    onClick={() => {
                      setIsAutoPlaying(false);
                      setCurrentIndex(i * 3);
                      setFlippedCards({});
                    }}
                    className={`
                      carousel-indicator h-3 rounded-full transition-all duration-300
                      ${Math.floor(currentIndex / 3) === i
                        ? "bg-gradient-to-r from-emerald-400 to-emerald-600 w-8 shadow-lg shadow-emerald-500/50"
                        : "bg-gray-600 w-3 hover:bg-gray-500"}
                    `}
                  />
                ))}
              </div>

              {/* Botão Direita */}
              <button
                onClick={handleNext}
                disabled={currentIndex + 3 >= heroes.length}
                className="
                  w-14 h-14
                  flex items-center justify-center
                  bg-gradient-to-br from-emerald-400 to-emerald-600
                  text-white
                  rounded-full
                  border-2 border-emerald-300
                  shadow-lg shadow-emerald-500/50
                  transition-all duration-300
                  hover:scale-110
                  hover:shadow-2xl
                  hover:shadow-emerald-500/70
                  active:scale-95
                  disabled:opacity-30
                  disabled:cursor-not-allowed
                  disabled:hover:scale-100
                "
              >
                <FaArrowRight size={20} />
              </button>
            </div>

            {/* Indicador de Auto-play */}
            <div className="text-center mt-6">
              <button
                onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                className="text-gray-400 hover:text-emerald-400 transition-colors text-sm font-semibold"
              >
                {isAutoPlaying ? '⏸️ Pausar rotação' : '▶️ Iniciar rotação'}
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}