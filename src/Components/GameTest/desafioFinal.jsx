import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { IoExitOutline } from 'react-icons/io5';
import { Play, Flame, Skull, Zap, Heart, Code, Sparkles } from 'lucide-react';
import BgPortal from "../../Assets/GameTest/bgPortal.png";
import BgBoss from "../../Assets/GameTest/BgBoss.png";
import Boss from "../../Assets/GameTest/Boss.png";
import FinalVitoria from "../../Assets/GameTest/BgFinalVitoria.png";
import { Navigate } from 'react-router-dom';


export default function DesafioFinal() {
  const [showCutscene, setShowCutscene] = useState(true);
  const [code, setCode] = useState('class Guerreiro:\n    def atacar(self):\n        # Completa aqui\n        ');
  const [feedback, setFeedback] = useState('');
  const [bossHealth, setBossHealth] = useState(100);
  const [playerHealth, setPlayerHealth] = useState(100);
  const [isValidating, setIsValidating] = useState(false);
  const [victory, setVictory] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [attackCount, setAttackCount] = useState(0);
  const [contentVisible, setContentVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setContentVisible(true), 1500);
    return () => clearTimeout(t);
  }, []);

  const navigate = useNavigate();

  const challenge = {
    title: "🐉 Dragão do Caos",
    description: "Completa o método atacar() para derrotar o dragão!",
    instruction: "Adiciona um print('Ataque!') dentro do método atacar()",
    hint: "💡 Dica: Usa print('Ataque!') para fazer o guerreiro atacar",
  };

  const validateCode = () => {
    setIsValidating(true);
    setFeedback('');
    setShowHint(false);

    setTimeout(() => {
      // Validação simples
      const hasClass = code.includes('class Guerreiro');
      const hasMethod = code.includes('def atacar');
      const hasPrint = code.toLowerCase().includes('print');
      const hasAttack = code.toLowerCase().includes('ataque');

      if (hasClass && hasMethod && hasPrint && hasAttack) {
        const damage = 33; // 3 ataques para derrotar (33 + 33 + 34 = 100)
        const newBossHealth = Math.max(0, bossHealth - damage);
        const newAttackCount = attackCount + 1;

        setAttackCount(newAttackCount);

        if (newBossHealth <= 0) {
          setFeedback(`✨ GOLPE FINAL! O dragão foi derrotado! 🐉💥`);
          setBossHealth(0);
          setTimeout(() => setVictory(true), 1500);
        } else {
          setFeedback(`⚔️ Ataque ${newAttackCount} bem-sucedido! -${damage} HP ao dragão!`);
          setBossHealth(newBossHealth);
        }
      } else {
        // Erro - Boss ataca
        setPlayerHealth(prev => Math.max(0, prev - 20));

        if (!hasPrint) {
          setFeedback('❌ Falta o comando print! O dragão contra-atacou!');
        } else if (!hasAttack) {
          setFeedback('❌ A mensagem deve ser "Ataque!"! O dragão contra-atacou!');
        } else {
          setFeedback('❌ Algo está errado! O dragão contra-atacou!');
        }

        setShowHint(true);
      }

      setIsValidating(false);
    }, 1000);
  };

  const skipCutscene = () => {
    setShowCutscene(false);
  };

  if (victory) {
    return (
      <div
        className="min-h-screen bg-gradient-to-br from-green-900 via-emerald-800 to-teal-900 flex items-center justify-center p-8 relative overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(rgba(2,6,23,0.6), rgba(2,6,23,0.6)), url(${FinalVitoria})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <button
          onClick={() => navigate("/gametest")}
          className="absolute left-6 top-6 z-50 flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
          aria-label="Voltar"
        >
          <IoExitOutline size={20} />
          Voltar
        </button>

        {/* Particles de vitória */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-10 left-10 w-64 h-64 bg-green-400 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-emerald-400 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        <div className={`relative z-10 text-center max-w-2xl transition-all duration-700 ease-out ${contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <div className="mb-8 animate-bounce">
            <Sparkles className="w-32 h-32 mx-auto text-yellow-300" />
          </div>

          <h1 className="text-6xl font-bold text-yellow-300 mb-4 drop-shadow-[0_0_30px_rgba(253,224,71,0.8)]">
            🏆 VITÓRIA!
          </h1>

          <p className="text-3xl text-white mb-6">
            Derrotaste o Dragão do Caos!
          </p>

          <div className="bg-slate-900/80 backdrop-blur-sm border-4 border-yellow-400 rounded-2xl p-8 mb-8">
            <p className="text-xl text-green-300 mb-4">
              ✨ Dominaste os conceitos básicos de POO!
            </p>
            <p className="text-lg text-gray-300">
              O caminho da caverna está aberto. Estás pronto para as próximas fases!
            </p>
          </div>

          <button
            onClick={() => Navigate('/DesafioFinalGameTest')}
            className="bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold text-xl px-12 py-4 rounded-xl hover:scale-105 transition-transform shadow-[0_0_30px_rgba(34,197,94,0.5)]"
          >
            🎮 Continuar Aventura
          </button>
        </div>
      </div>
    );
  }

  if (showCutscene) {
    return (
      <div className="min-h-screen p-5 font-['Cinzel'] text-gray-200 flex items-center justify-center relative overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(rgba(2,6,23,0.6), rgba(2,6,23,0.6)), url(${BgPortal})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}>
        <button
          onClick={() => navigate("/gametest")}
          className="absolute left-6 top-6 z-50 flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
          aria-label="Voltar"
        >
          <IoExitOutline size={20} />
          Voltar
        </button>

        {/* Efeitos de fundo */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-20 w-72 h-72 bg-red-600 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-orange-600 rounded-full blur-3xl animate-pulse delay-700"></div>
        </div>

        <div className={`relative z-10 max-w-3xl text-center space-y-8 transition-all duration-700 ease-out ${contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <div className="mb-8">
            <Skull className="w-32 h-32 mx-auto text-red-500 animate-pulse" />
          </div>

          <h1 className="text-5xl font-bold text-red-400 mb-6 drop-shadow-[0_0_20px_rgba(239,68,68,0.8)]">
            ⚔️ Fase 3 - O Desafio Final
          </h1>

          <div className="bg-slate-900/80 backdrop-blur-sm border-4 border-red-500 rounded-2xl p-8 space-y-6">
            <p className="text-2xl text-orange-300 font-semibold">
              "A entrada da caverna está à tua frente..."
            </p>

            <p className="text-xl text-gray-200 leading-relaxed">
              O <span className="text-red-400 font-bold">Dragão do Caos</span> sente a tua presença.
              As suas escamas brilham com poder ancestral, e os seus olhos fixam-se em ti.
            </p>

            <p className="text-xl text-gray-200 leading-relaxed">
              Para prosseguir, terás de provar que dominas os <span className="text-blue-400 font-bold">conceitos básicos do código</span>.
            </p>

            <div className="flex items-center justify-center gap-4 pt-4">
              <Flame className="w-8 h-8 text-orange-500 animate-pulse" />
              <p className="text-lg text-yellow-300 font-bold">
                A batalha está prestes a começar!
              </p>
              <Flame className="w-8 h-8 text-orange-500 animate-pulse" />
            </div>
          </div>

          <button
            onClick={skipCutscene}
            className="bg-gradient-to-r from-red-600 to-orange-600 text-white font-bold text-2xl px-12 py-5 rounded-xl hover:scale-105 transition-all shadow-[0_0_30px_rgba(239,68,68,0.6)]"
          >
            ⚔️ Enfrentar o Dragão
          </button>

          <p className="text-sm text-gray-400 mt-4">
            Pressiona para começar a batalha
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br font-['Cinzel'] flex relative overflow-hidden">
      {/* Efeitos de fundo */}
      <div className="absolute inset-0 " style={{
          backgroundImage: `linear-gradient(rgba(2,6,23,0.6), rgba(2,6,23,0.6)), url(${BgBoss})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}>
        
      </div>
       <button
          onClick={() => navigate("/gametest")}
          className="absolute left-6 top-6 z-50 flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
          aria-label="Voltar"
        >
          <IoExitOutline size={20} />
          Voltar
        </button>
      {/* Lado Esquerdo - Boss */}
      <div className="w-1/2 flex flex-col items-center justify-center p-8 relative z-10">
        <div className="max-w-lg w-full space-y-6">
          {/* Boss Info */}
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-red-400 mb-2 drop-shadow-[0_0_15px_rgba(239,68,68,0.8)]">
              {challenge.title}
            </h2>
            <p className="text-gray-300 text-lg">{challenge.description}</p>
          </div>

          {/* Boss SVG/Visual */}
          <div className="relative">
            {/* Boss Health Bar */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-red-400 font-bold flex items-center gap-2">
                  <Skull className="w-5 h-5" />
                  Dragão do Caos
                </span>
                <span className="text-red-300">{bossHealth}/100 HP</span>
              </div>
              <div className="h-6 bg-slate-800 rounded-full overflow-hidden border-2 border-red-500">
                <div
                  className="h-full bg-gradient-to-r from-red-600 to-orange-500 transition-all duration-500"
                  style={{ width: `${bossHealth}%` }}
                />
              </div>
            </div>

            {/* Boss Visual - SVG Dragon */}
            <div className="bg-slate-800/50 backdrop-blur-sm border-4 border-red-500 rounded-2xl p-8 flex items-center justify-center relative overflow-hidden">
              {/* Efeito de fogo de fundo */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute bottom-0 left-1/4 w-32 h-32 bg-orange-500 rounded-full blur-2xl animate-pulse"></div>
                <div className="absolute bottom-0 right-1/4 w-32 h-32 bg-red-500 rounded-full blur-2xl animate-pulse delay-500"></div>
              </div>

              {/* Dragon SVG */}
              <img src={Boss} alt="Dragão do Caos" className="w-250 h-50 relative z-10 animate-[float_3s_ease-in-out_infinite]" />
            </div>

            {/* Player Health */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-blue-400 font-bold flex items-center gap-2">
                  <Heart className="w-5 h-5" />
                  Tu (Guerreiro)
                </span>
                <span className="text-blue-300">{playerHealth}/100 HP</span>
              </div>
              <div className="h-6 bg-slate-800 rounded-full overflow-hidden border-2 border-blue-500">
                <div
                  className="h-full bg-gradient-to-r from-blue-600 to-cyan-500 transition-all duration-500"
                  style={{ width: `${playerHealth}%` }}
                />
              </div>
            </div>
          </div>

          {/* Ações do Boss */}
          {bossHealth < 70 && bossHealth > 0 && (
            <div className="bg-red-900/30 border-2 border-red-500 rounded-lg p-4 animate-pulse">
              <div className="flex items-center gap-3">
                <Flame className="w-6 h-6 text-orange-500" />
                <p className="text-orange-300 font-semibold">
                  O dragão ruge ferozmente! Está a ficar mais forte!
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Lado Direito - Editor de Código */}
      <div className="w-1/2 flex flex-col p-8 relative z-10">
        <div className="bg-slate-900/90 backdrop-blur-sm border-4 border-blue-500 rounded-2xl flex-1 flex flex-col overflow-hidden shadow-[0_0_30px_rgba(59,130,246,0.4)]">
          {/* Header */}
          <div className="bg-slate-800 border-b-2 border-blue-500 p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Code className="w-5 h-5 text-green-400" />
                <span className="font-mono text-sm text-gray-300">guerreiro.py</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Zap className="w-4 h-4" />
                <span>Python 3</span>
              </div>
            </div>

            <div className="bg-blue-900/30 border-2 border-blue-400 rounded-lg p-3">
              <p className="text-blue-200 text-sm font-semibold mb-2">
                📝 {challenge.instruction}
              </p>
              <div className="flex items-center gap-2 text-xs text-blue-300">
                <span>Ataques necessários:</span>
                <div className="flex gap-1">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className={`w-6 h-6 rounded-full flex items-center justify-center font-bold ${i <= attackCount
                          ? 'bg-green-500 text-white'
                          : 'bg-slate-700 text-gray-400 border-2 border-slate-600'
                        }`}
                    >
                      {i <= attackCount ? '✓' : i}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Editor */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 flex">
              {/* Números de linha */}
              <div className="w-12 bg-slate-800 text-gray-500 text-right pr-2 py-4 font-mono text-sm select-none border-r border-slate-700">
                {code.split('\n').map((_, i) => (
                  <div key={i} className="leading-6">{i + 1}</div>
                ))}
              </div>

              {/* Área de código */}
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="flex-1 bg-slate-950 text-green-400 p-4 font-mono text-base resize-none focus:outline-none"
                style={{ lineHeight: '1.5rem', tabSize: 4 }}
                spellCheck="false"
                placeholder="# Escreve o teu código aqui..."
              />
            </div>

            {/* Terminal Output */}
            <div className="h-32 bg-slate-950 border-t-2 border-slate-700">
              <div className="flex items-center justify-between px-4 py-2 bg-slate-800 border-b border-slate-700">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-300 font-mono">Terminal</span>
                </div>
              </div>
              <div className="p-4 font-mono text-sm text-green-400 overflow-auto h-[calc(100%-40px)]">
                {feedback ? (
                  <div>
                    <span className="text-gray-500">{'>'} python guerreiro.py</span>
                    <br />
                    {feedback.includes('✨') || feedback.includes('⚔️') ? (
                      <span className="text-green-400">Ataque!</span>
                    ) : (
                      <span className="text-red-400">Erro: código incompleto</span>
                    )}
                  </div>
                ) : (
                  <span className="text-gray-500">Aguardando execução...</span>
                )}
              </div>
            </div>

            {/* Feedback Area */}
            <div className="border-t-2 border-slate-700 p-4 bg-slate-800 space-y-3">
              {feedback && (
                <div className={`px-4 py-3 rounded-lg font-semibold ${feedback.includes('✨')
                    ? 'bg-green-500/20 border-2 border-green-400 text-green-300'
                    : 'bg-red-500/20 border-2 border-red-400 text-red-300'
                  }`}>
                  {feedback}
                </div>
              )}

              {showHint && (
                <div className="bg-yellow-500/20 border-2 border-yellow-400 rounded-lg px-4 py-3 text-yellow-300 text-sm">
                  {challenge.hint}
                </div>
              )}

              <button
                onClick={validateCode}
                disabled={isValidating || playerHealth <= 0}
                className={`w-full py-4 rounded-xl font-bold text-xl transition-all flex items-center justify-center gap-3 ${isValidating || playerHealth <= 0
                    ? 'bg-gray-600 cursor-not-allowed opacity-50'
                    : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(34,197,94,0.6)]'
                  } text-white shadow-lg`}
              >
                {isValidating ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    A validar...
                  </>
                ) : playerHealth <= 0 ? (
                  <>💀 Derrotado</>
                ) : (
                  <>
                    <Play className="w-5 h-5" />
                    ⚔️ Atacar o Dragão!
                  </>
                )}
              </button>

              {playerHealth <= 0 && (
                <button
                  onClick={() => window.location.reload()}
                  className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                >
                  🔄 Tentar Novamente
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

