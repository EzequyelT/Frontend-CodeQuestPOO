niveis{
    desafios
}
🌲 Floresta → fundamentos (variáveis, lógica simples)
Floresta dos Algoritmos — Sugestão de Níveis e Desafios
Nível	Número de desafios	Descrição rápida
Nível 1	3	Fundamentos de lógica: variáveis, prints e atenção à sintaxe básica.
Nível 2	3	Introdução a condicionais simples (if/else), pequenas escolhas de lógica.
Nível 3	2	Combinação de variáveis e condições, preparação para o boss final.

✅ Total: 3 níveis, 8 desafios → ideal para o primeiro mapa.

💡 Dicas de implementação:
Nível 1:
Corrigir erros de sintaxe simples (print, parênteses, aspas)
Explorar variáveis básicas
Nível 2:
Pequenos trechos de código com if e else
Questões de verdadeiro/falso sobre lógica
Nível 3:
Mistura de variáveis + condições
Pequenos códigos para corrigir
Prepara para o Boss: Serpente do Bug

🏘️ Vila → estruturas e funções

🏰 Castelo → POO (herança, encapsulamento, polimorfismo)


floresta

import map from "../../assets/Maps/Map1.png";
import banner from "../../assets/Maps/Banner.jpg";
import { Star, Gem, Trophy, Users, ChevronLeft } from "lucide-react";

export default function FlorestaDosAlgoritmos() {
    return (
        <div style={{ fontFamily: "DM Sans, sans-serif", background: "black" }}>
            {/* TOP HUD */}

            <header className="relative w-full flex items-center justify-between px-4 sm:px-6 py-3">

                {/* LEFT */}
                <button
                    className="flex items-center gap-1 whitespace-nowrap
    font-serif font-bold text-xs sm:text-[13px] tracking-wide
    text-[#f5dfa0] bg-black
    border-2 border-[#a0621a] border-b-[#6b3a0a]
    px-3 py-2 rounded-md cursor-pointer
    transition hover:brightness-125
    shadow-[0_3px_0_#2a1000,inset_0_1px_0_rgba(255,220,120,0.15)]"
                >
                    <ChevronLeft size={14} />
                    <span className="hidden sm:inline">Voltar ao Mapa</span>
                </button>

                {/* CENTER */}
                <div className="pointer-events-none absolute left-1/2 -translate-x-1/2 translate-y-1/4
    translate-y-10 flex flex-col items-center">

                    <div className="relative flex items-center justify-center">

                        <img
                            src={banner}
                            alt="banner"
                            className="
          h-130 sm:h-16 md:h-30
          w-150 sm:w-64 md:w-100
          
        "
                        />

                        {/* TITLE */}
                        <h1
                            className="
          absolute text-white
          font-serif font-bold
          text-sm sm:text-lg md:text-xl
          tracking-wide
          leading-none
          mt-4
          animate-bounce
        "
                        >
                            Floresta dos Algoritmos
                        </h1>
                    </div>

                    {/* SUBTITLE */}
                    <h2
                        className="
        text-white
        text-[12px] sm:text-xs
        -mt-0.5
        tracking-wide
        font-bold
      "
                    >
                        0/3 desafios completos
                    </h2>

                </div>

                {/* RIGHT */}
                <div className="flex items-center gap-2 sm:gap-3">

                    <div
                        className="flex items-center gap-1 px-2 sm:px-3 py-1
      rounded-full text-xs sm:text-sm font-semibold
      bg-black/45 border-[1.5px] border-yellow-400 text-yellow-200"
                    >
                        <Star size={14} className="fill-yellow-400 text-yellow-400" />
                        <span>0</span>
                    </div>

                    <div
                        className="flex items-center gap-1 px-2 sm:px-3 py-1
      rounded-full text-xs sm:text-sm font-semibold
      bg-black/45 border-[1.5px] border-violet-400 text-violet-200"
                    >
                        <Gem size={14} className="fill-violet-400 text-violet-400" />
                        <span>0</span>
                    </div>

                </div>
            </header>

            {/* MAP */}
            <main className="w-full flex justify-center items-center mt-22">
                <div
                    className="
    flex justify-center items-center
    w-[1100px] max-w-[120vw]
  "
                >
                    <img
                        src={map}
                        alt="Mapa da Floresta dos Algoritmos"
                        className="
      w-full
      h-auto
      object-contain
    "
                        style={{
                            filter: `
        drop-shadow(0 0 2px white)
        drop-shadow(0 0 2px white)
        drop-shadow(0 0 4px white)
        drop-shadow(0 0 8px rgba(255,255,255,0.5))
      `
                        }}
                    />
                </div>
            </main>

            {/* BOTTOM HUD */}
            <footer className="flex items-center gap-2 px-5 
        h-[60px] flex-shrink-0 z-10
        bg-gradient-to-t from-[#000000] 
        border-t-2 ">

                {/* Heroes */}
                <button className="flex flex-col items-center justify-center
          w-[68px] h-[68px] gap-1
          rounded-lg cursor-pointer
          font-serif font-bold text-[10px] tracking-wide
          border-2 border-[#8b4a1a]
          text-[#f5c878]
          transition hover:brightness-125 hover:-translate-y-0.5
          shadow-[0_4px_0_rgba(0,0,0,0.5)]
          bg-gradient-to-b from-[#4a2a10] to-[#2a1508]">

                    <Users size={26} />
                    Heróis
                </button>

                {/* Trophies */}
                <button className="flex flex-col items-center justify-center
          w-[68px] h-[68px] gap-1
          rounded-lg cursor-pointer
          font-serif font-bold text-[10px] tracking-wide
          border-2 border-[#9b8a2a]
          text-yellow-200
          transition hover:brightness-125 hover:-translate-y-0.5
          shadow-[0_4px_0_rgba(0,0,0,0.5)]
          bg-gradient-to-b from-[#4a3a10] to-[#2a2008]">

                    <Trophy size={26} />
                    Conquistas
                </button>

                <span className="ml-auto font-serif text-[13px] tracking-wide text-[#c8a060] drop-shadow">
                    Você está no nível …
                </span>
            </footer>
        </div>
    );
}