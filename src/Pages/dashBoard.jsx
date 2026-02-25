import React, { useState } from 'react';
import { Trophy, Clock, Award, Zap, Flame, Lock, CheckCircle, Target, TrendingUp, Gift, Calendar } from 'lucide-react';

export default function DashBoard(){
  const [activeTab, setActiveTab] = useState('profile');

  // Sample data - Educational POO Game
  const userData = {
    username: 'CodeMaster',
    hero: 'Mago Azul',
    heroIcon: '🧙‍♂️',
    level: 12,
    currentXp: 2450,
    nextLevelXp: 3000,
    streak: 7,
    coins: 1850,
    totalPlaytime: 42.5,
    challengesCompleted: 23,
    accuracy: 78,
    hintsUsed: 15,
    consecutiveDays: 7,
    memberSince: 'Set 2024'
  };

  // Maps/Worlds
  const maps = [
    {
      id: 1,
      name: 'Floresta Encantada',
      icon: '🌲',
      challenges: 8,
      boss: 'Guardião da Floresta',
      bossIcon: '🐺',
      completed: 8,
      unlocked: true,
      progress: 100,
      bgColor: 'from-emerald-600 to-green-700'
    },
    {
      id: 2,
      name: 'Vila Misteriosa',
      icon: '🏘️',
      challenges: 8,
      boss: 'Cavaleiro Sombrio',
      bossIcon: '⚔️',
      completed: 6,
      unlocked: true,
      progress: 75,
      bgColor: 'from-amber-600 to-orange-700'
    },
    {
      id: 3,
      name: 'Castelo do Dragão',
      icon: '🏰',
      challenges: 10,
      boss: 'Dragão Ancestral',
      bossIcon: '🐉',
      completed: 0,
      unlocked: false,
      progress: 0,
      bgColor: 'from-purple-600 to-pink-700'
    }
  ];

  // Current active map
  const currentMap = maps.find(m => m.unlocked && m.progress < 100) || maps[1];

  // Common errors
  const commonErrors = [
    { type: 'Sintaxe', count: 12, percentage: 35 },
    { type: 'Lógica', count: 8, percentage: 24 },
    { type: 'Encapsulamento', count: 7, percentage: 21 },
    { type: 'Herança', count: 7, percentage: 20 }
  ];

  // Trophies
  const trophies = [
    { id: 1, name: 'Primeira Vitória', icon: '🏆', unlocked: true },
    { id: 2, name: 'Mestre da Floresta', icon: '🌳', unlocked: true },
    { id: 3, name: 'Sem Erros', icon: '✨', unlocked: true },
    { id: 4, name: 'Streak 7 dias', icon: '🔥', unlocked: true },
    { id: 5, name: 'Explorador', icon: '🗺️', unlocked: false },
    { id: 6, name: 'Mestre POO', icon: '👑', unlocked: false }
  ];

  // Daily mission
  const dailyMission = {
    title: 'Complete 3 desafios sem usar dicas',
    progress: 1,
    total: 3,
    reward: 100,
    completed: false
  };

  // Login reward
  const loginReward = {
    day: 7,
    coins: 150,
    bonus: 'Dobro de XP por 1 hora',
    claimed: false
  };

  const maxErrors = Math.max(...commonErrors.map(e => e.count));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white p-6 font-sans">
      {/* Header */}
      <header className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <div className="text-indigo-400 font-bold text-3xl tracking-tighter flex items-center gap-2">
            <span>{'</>'}</span>
            <span className="text-white">CodeQuest</span>
          </div>
          <div className="flex gap-6 ml-8">
            <button className="text-gray-400 hover:text-white transition-colors text-sm">
              Dashboard
            </button>
            <button className="text-gray-400 hover:text-white transition-colors text-sm">
              Mapas
            </button>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2 bg-amber-500/10 px-3 py-2 rounded-lg border border-amber-500/30">
              <span className="text-2xl">🪙</span>
              <span className="font-bold text-amber-400">{userData.coins}</span>
            </div>
            <div className="flex items-center gap-2 bg-orange-500/10 px-3 py-2 rounded-lg border border-orange-500/30">
              <Flame className="w-5 h-5 text-orange-400" />
              <span className="font-bold text-orange-400">{userData.streak}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Clock className="w-4 h-4" />
              <span>{userData.totalPlaytime.toFixed(1)}h</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-2xl border-2 border-indigo-400/50">
            {userData.heroIcon}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex gap-6">
        {/* Sidebar */}
        <aside className="w-64 flex flex-col gap-2">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              activeTab === 'profile'
                ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/50'
                : 'text-gray-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <div className="w-8 h-8 flex items-center justify-center text-xl">{userData.heroIcon}</div>
            <span className="font-medium">Perfil</span>
          </button>
          <button className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-slate-800 transition-all">
            <div className="w-8 h-8 flex items-center justify-center text-xl">🗺️</div>
            <span className="font-medium">Mapas</span>
          </button>
          <button className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-slate-800 transition-all">
            <div className="w-8 h-8 flex items-center justify-center text-xl">🏆</div>
            <span className="font-medium">Troféus</span>
          </button>
          <button className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-slate-800 transition-all">
            <div className="w-8 h-8 flex items-center justify-center text-xl">📚</div>
            <span className="font-medium">Aprendizado</span>
          </button>
          <button className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-slate-800 transition-all">
            <div className="w-8 h-8 flex items-center justify-center text-xl">🎯</div>
            <span className="font-medium">Missões</span>
          </button>
          <button className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-slate-800 transition-all mt-auto">
            <div className="w-8 h-8 flex items-center justify-center text-xl">⚙️</div>
            <span className="font-medium">Configurações</span>
          </button>
        </aside>

        {/* Main Panel */}
        <main className="flex-1">
          {/* Login Reward Banner */}
          {!loginReward.claimed && (
            <div className="bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl p-6 mb-6 border-2 border-amber-400 shadow-2xl shadow-amber-500/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Gift className="w-12 h-12 text-white" />
                  <div>
                    <h3 className="text-xl font-bold text-white">Recompensa de Login - Dia {loginReward.day}! 🎉</h3>
                    <p className="text-amber-100">+{loginReward.coins} moedas • {loginReward.bonus}</p>
                  </div>
                </div>
                <button className="bg-white text-amber-600 px-6 py-3 rounded-xl font-bold hover:scale-105 transition-transform">
                  Resgatar
                </button>
              </div>
            </div>
          )}

          {/* Profile Header */}
          <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl p-8 mb-6 border border-slate-800/50 shadow-2xl">
            <div className="flex items-start justify-between mb-8">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-5xl border-4 border-indigo-400/50 shadow-lg shadow-indigo-500/50">
                    {userData.heroIcon}
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-indigo-500 text-white px-3 py-1 rounded-full text-sm font-bold border-2 border-slate-900">
                    Lv {userData.level}
                  </div>
                </div>
                <div>
                  <h2 className="text-3xl font-bold mb-1">{userData.username}</h2>
                  <p className="text-indigo-400 text-lg font-medium mb-2">{userData.hero}</p>
                  <p className="text-gray-400 text-sm">Membro desde {userData.memberSince}</p>
                </div>
              </div>
            </div>

            {/* XP Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">Nível {userData.level}</span>
                <span className="text-indigo-400 font-semibold">{userData.currentXp} / {userData.nextLevelXp} XP</span>
              </div>
              <div className="h-4 bg-slate-800 rounded-full overflow-hidden shadow-inner">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full transition-all duration-1000 shadow-lg"
                  style={{ width: `${(userData.currentXp / userData.nextLevelXp) * 100}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1 text-right">
                Faltam {userData.nextLevelXp - userData.currentXp} XP para o próximo nível
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <p className="text-gray-400 text-sm">Desafios</p>
                </div>
                <p className="text-2xl font-bold">{userData.challengesCompleted}</p>
              </div>
              <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-5 h-5 text-blue-400" />
                  <p className="text-gray-400 text-sm">Taxa de Acerto</p>
                </div>
                <p className="text-2xl font-bold">{userData.accuracy}%</p>
              </div>
              <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-5 h-5 text-yellow-400" />
                  <p className="text-gray-400 text-sm">Dicas Usadas</p>
                </div>
                <p className="text-2xl font-bold">{userData.hintsUsed}</p>
              </div>
              <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                <div className="flex items-center gap-2 mb-2">
                  <Flame className="w-5 h-5 text-orange-400" />
                  <p className="text-gray-400 text-sm">Dias Seguidos</p>
                </div>
                <p className="text-2xl font-bold">{userData.consecutiveDays}</p>
              </div>
            </div>

            {/* Current Map Progress */}
            <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 rounded-xl p-6 border border-slate-700/50">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="text-4xl">{currentMap.icon}</div>
                  <div>
                    <h3 className="text-xl font-bold">{currentMap.name}</h3>
                    <p className="text-sm text-gray-400">
                      {currentMap.completed}/{currentMap.challenges} Desafios • Boss: {currentMap.bossIcon} {currentMap.boss}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-indigo-400">{currentMap.progress}%</p>
                  <p className="text-xs text-gray-400">Progresso</p>
                </div>
              </div>
              <div className="h-3 bg-slate-900 rounded-full overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${currentMap.bgColor} rounded-full transition-all duration-1000`}
                  style={{ width: `${currentMap.progress}%` }}
                />
              </div>
            </div>
          </div>

          {/* Maps Overview */}
          <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl p-6 mb-6 border border-slate-800/50">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <span>🗺️</span> Mapas de Aprendizado
            </h3>
            <div className="grid grid-cols-3 gap-4">
              {maps.map((map) => (
                <div
                  key={map.id}
                  className={`relative rounded-xl p-6 border-2 transition-all hover:scale-105 ${
                    map.unlocked
                      ? `bg-gradient-to-br ${map.bgColor} border-white/20`
                      : 'bg-slate-800/50 border-slate-700/50 opacity-60'
                  }`}
                >
                  {!map.unlocked && (
                    <div className="absolute top-4 right-4">
                      <Lock className="w-6 h-6 text-gray-400" />
                    </div>
                  )}
                  <div className="text-5xl mb-3">{map.icon}</div>
                  <h4 className="text-lg font-bold mb-2">{map.name}</h4>
                  <div className="space-y-2 text-sm mb-4">
                    <p className="text-white/90">
                      {map.completed}/{map.challenges} Desafios
                    </p>
                    <p className="text-white/80 flex items-center gap-2">
                      <span>Boss:</span>
                      <span>{map.bossIcon} {map.boss}</span>
                    </p>
                  </div>
                  <div className="mb-2">
                    <div className="flex justify-between text-xs mb-1">
                      <span>Progresso</span>
                      <span className="font-bold">{map.progress}%</span>
                    </div>
                    <div className="h-2 bg-black/30 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-white/90 rounded-full transition-all"
                        style={{ width: `${map.progress}%` }}
                      />
                    </div>
                  </div>
                  {map.progress === 100 && (
                    <div className="absolute top-4 left-4 bg-yellow-400 text-black px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      Completo
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Three Column Grid */}
          <div className="grid grid-cols-3 gap-6">
            {/* Common Errors */}
            <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-800/50">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-red-400" />
                Tipos de Erros
              </h3>
              <div className="space-y-4">
                {commonErrors.map((error, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-300">{error.type}</span>
                      <span className="text-sm font-bold text-red-400">{error.count}</span>
                    </div>
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-red-500 to-orange-500 rounded-full"
                        style={{ width: `${(error.count / maxErrors) * 100}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{error.percentage}% dos erros</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Trophies */}
            <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-800/50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-400" />
                  Troféus
                </h3>
                <span className="text-sm text-gray-400">
                  {trophies.filter(t => t.unlocked).length}/{trophies.length}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {trophies.map((trophy) => (
                  <div
                    key={trophy.id}
                    className={`relative aspect-square rounded-xl flex flex-col items-center justify-center text-center p-2 transition-all hover:scale-105 ${
                      trophy.unlocked
                        ? 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-2 border-yellow-500/50'
                        : 'bg-slate-800/50 border-2 border-slate-700/50 grayscale opacity-40'
                    }`}
                  >
                    <div className="text-3xl mb-1">{trophy.icon}</div>
                    <p className="text-xs text-gray-300 leading-tight">{trophy.name}</p>
                    {!trophy.unlocked && (
                      <Lock className="absolute top-1 right-1 w-3 h-3 text-gray-500" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Daily Mission */}
            <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-800/50">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-400" />
                Missão Diária
              </h3>
              <div className="bg-slate-800/50 rounded-xl p-4 mb-4">
                <div className="flex items-start gap-3 mb-3">
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    dailyMission.completed ? 'bg-green-500' : 'bg-blue-500'
                  }`}>
                    {dailyMission.completed ? '✓' : '!'}
                  </div>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    {dailyMission.title}
                  </p>
                </div>
                <div className="mb-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-400">Progresso</span>
                    <span className="font-bold text-blue-400">
                      {dailyMission.progress}/{dailyMission.total}
                    </span>
                  </div>
                  <div className="h-2 bg-slate-900 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
                      style={{ width: `${(dailyMission.progress / dailyMission.total) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-slate-700">
                  <span className="text-xs text-gray-400">Recompensa:</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🪙</span>
                    <span className="text-lg font-bold text-amber-400">+{dailyMission.reward}</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-orange-500/20 to-yellow-500/20 border border-orange-500/30 rounded-xl p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Flame className="w-5 h-5 text-orange-400" />
                  <span className="font-semibold text-sm">Streak Ativo!</span>
                </div>
                <p className="text-xs text-gray-300">
                  Continue jogando por mais <span className="font-bold text-white">3 dias</span> para desbloquear o troféu "Streak 10 dias"!
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-20 right-20 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        
        * {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out;
        }
      `}</style>
    </div>
  );
};

