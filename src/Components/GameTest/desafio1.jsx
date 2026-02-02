import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom"
import Bg from "../../Assets/GameTest/Bgdesafio1e2.jpg";
import { IoExitOutline } from "react-icons/io5";

export default function Desafio1GameTest() {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [feedback, setFeedback] = useState('');
    const [showResult, setShowResult] = useState(false);
    const [draggedItem, setDraggedItem] = useState(null);
    const [answers, setAnswers] = useState({});
    const [showHint, setShowHint] = useState(false);
    const [attempts, setAttempts] = useState({});
    const [contentVisible, setContentVisible] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => setContentVisible(true), 1800);
        return () => clearTimeout(t);
    }, []);

    const questions = [
        {
            id: 1,
            question: "Arrasta os conceitos para os seus significados:",
            pairs: [
                { term: "Classe", definition: "Molde para criar objetos", id: "pair1" },
                { term: "objeto", definition: "Instância de uma classe", id: "pair2" },
                { term: "Atributo", definition: "Variável dentro de uma classe", id: "pair3" }
            ],
            hint: "💡 Dica: Uma Classe é como uma receita de bolo, e o objeto é o bolo que fizeste!"
        },
        {
            id: 2,
            question: "Qual destas opções representa uma classe em Python?",
            type: "choice",
            options: [
                { text: "class Heroi:\n    pass", correct: true },
                { text: "def heroi():\n    pass", correct: false },
                { text: "heroi = {}", correct: false }
            ],
            hint: "💡 Dica: Em Python, usamos a palavra-chave 'class' para definir uma classe!"
        },
        {
            id: 3,
            question: "Associa cada termo POO com a sua função:",
            pairs: [
                { term: "__init__", definition: "Construtor da classe", id: "pair4" },
                { term: "self", definition: "Referência à instância actual", id: "pair5" },
                { term: "método", definition: "Função dentro de uma classe", id: "pair6" }
            ],
            hint: "💡 Dica: __init__ é chamado quando crias um novo objeto. O 'self' refere-se ao próprio objeto!"
        },
        {
            id: 4,
            question: "Como criamos um objeto da classe Heroi?",
            type: "choice",
            options: [
                { text: "heroi1 = Heroi()", correct: true },
                { text: "heroi1 = new Heroi()", correct: false },
                { text: "heroi1 = class.Heroi()", correct: false }
            ],
            hint: "💡 Dica: Em Python, não usamos 'new'! Simplesmente chamamos a classe como uma função."
        },
        {
            id: 5,
            question: "Arrasta os elementos do código para o seu tipo:",
            pairs: [
                { term: "vida = 100", definition: "Atributo de instância", id: "pair7" },
                { term: "def atacar(self)", definition: "Método de instância", id: "pair8" },
                { term: "class Guerreiro", definition: "Definição de classe", id: "pair9" }
            ],
            hint: "💡 Dica: Atributos guardam dados, métodos executam ações, e 'class' define a estrutura!"
        }
    ];

    const currentQ = questions[currentQuestion];
    const navigate = useNavigate();


    const handleDragStart = (e, item) => {
        setDraggedItem(item);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = (e, targetDefinition) => {
        e.preventDefault();
        if (!draggedItem) return;

        const newAnswers = { ...answers };
        newAnswers[currentQuestion] = newAnswers[currentQuestion] || {};
        newAnswers[currentQuestion][targetDefinition] = draggedItem.term;
        setAnswers(newAnswers);
        setDraggedItem(null);
    };

    const removeDroppedItem = (targetDefinition) => {
        const newAnswers = { ...answers };
        if (newAnswers[currentQuestion]) {
            delete newAnswers[currentQuestion][targetDefinition];
            setAnswers(newAnswers);
        }
    };

    const handleChoiceClick = (option) => {
        const newAnswers = { ...answers };
        if (newAnswers[currentQuestion] === option) {
            delete newAnswers[currentQuestion];
        } else {
            newAnswers[currentQuestion] = option;
        }
        setAnswers(newAnswers);
    };

    const checkAnswer = () => {
        let isCorrect = false;

        if (currentQ.type === 'choice') {
            isCorrect = answers[currentQuestion]?.correct === true;
        } else {
            // Check drag and drop
            const userAnswers = answers[currentQuestion] || {};
            isCorrect = currentQ.pairs.every(pair =>
                userAnswers[pair.definition] === pair.term
            );
        }

        // Track attempts
        const newAttempts = { ...attempts };
        newAttempts[currentQuestion] = (newAttempts[currentQuestion] || 0) + 1;
        setAttempts(newAttempts);

        if (isCorrect) {
            setScore(score + 1);
            setFeedback('✨ Correcto! Avança pela caverna...');
            setShowHint(false);
        } else {
            setFeedback('❌ Não é bem assim... Tenta de novo!');
            setShowHint(true);
        }

        setTimeout(() => {
            if (currentQuestion < questions.length - 1) {
                setCurrentQuestion(currentQuestion + 1);
                setFeedback('');
                setShowHint(false);
            } else {
                setShowResult(true);
            }
        }, 2500);
    };

    const resetQuiz = () => {
        setCurrentQuestion(0);
        setScore(0);
        setFeedback('');
        setShowResult(false);
        setAnswers({});
        setShowHint(false);
        setAttempts({});
    };

    const canProceed = () => {
        if (currentQ.type === 'choice') {
            return answers[currentQuestion] !== undefined;
        } else {
            const userAnswers = answers[currentQuestion] || {};
            return currentQ.pairs.every(pair => userAnswers[pair.definition]);
        }
    };

    if (showResult) {
        const percentage = (score / questions.length) * 100;
        let message = '';
        if (percentage === 100) {
            message = '🏆 Perfeito! És um mestre da POO!';
        } else if (percentage >= 60) {
            message = '⚔️ Bom trabalho! Continua a treinar!';
        } else {
            message = '🌱 Precisas de mais prática. Tenta novamente!';
        }

        return (
            <div
                className="min-h-screen p-5 font-['Cinzel'] text-gray-200 flex items-center justify-center relative overflow-hidden"
                style={{
                    backgroundImage: `linear-gradient(rgba(2,6,23,0.6), rgba(2,6,23,0.6)), url(${Bg})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                }}
            >
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-20 left-20 w-72 h-72 bg-blue-400 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-20 right-20 w-96 h-96 bg-indigo-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
                </div>

                <div className="w-full max-w-2xl bg-slate-900/80 backdrop-blur-sm border-4 border-blue-400 rounded-2xl p-12 text-center shadow-[0_0_40px_rgba(59,130,246,0.5)] relative z-10">
                    <h1 className="text-5xl font-bold text-green-400 mb-8 drop-shadow-[0_0_20px_rgba(126,217,87,0.7)]">
                        🎯 Missão Completa!
                    </h1>

                    <div className="w-52 h-52 mx-auto mb-8 bg-gradient-to-br from-blue-400 to-green-400 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(59,130,246,0.6)] animate-pulse">
                        <div className="text-6xl font-bold text-white">
                            {score}/{questions.length}
                        </div>
                    </div>

                    <p className="text-2xl text-white mb-4">{message}</p>
                    <p className="text-xl text-gray-300 mb-8">{percentage.toFixed(0)}% de acertos</p>

                    <button
                        onClick={resetQuiz}
                        className="bg-gradient-to-r from-blue-500 to-green-500 text-white font-bold text-xl px-10 py-4 rounded-xl shadow-[0_8px_20px_rgba(59,130,246,0.5)] hover:scale-105 hover:shadow-[0_12px_30px_rgba(59,130,246,0.6)] transition-all"
                    >
                        🔄 Tentar Novamente
                    </button>
                    <button
                        onClick={() => navigate("/gametest")}
                        className="bg-gradient-to-r from-blue-500 to-green-500 text-white font-bold text-xl px-10 py-4 rounded-xl shadow-[0_8px_20px_rgba(59,130,246,0.5)] hover:scale-105 hover:shadow-[0_12px_30px_rgba(59,130,246,0.6)] transition-all"
                    >
                        Voltar
                    </button>
                </div>
            </div>
        );
    }


    return (
        <div
            className="min-h-screen p-5 font-mono text-gray-200 flex flex-col items-center justify-center relative overflow-hidden"
            style={{
                backgroundImage: `linear-gradient(rgba(2,6,23,0.6), rgba(2,6,23,0.6)), url(${Bg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
            }}
        >
            <button
                onClick={() => navigate("/gametest")}
                className="absolute left-6 top-6 z-50 flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
                aria-label="Sair"
            >
                <IoExitOutline size={22} />
                Sair
            </button>

            {/* Animated background elements */}
            <div className="absolute inset-0 opacity-20">
                <div className="absolute top-20 left-20 w-72 h-72 bg-blue-400 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-20 right-20 w-96 h-96 bg-indigo-500 rounded-full blur-3xl animate-pulse delay-700"></div>
                <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-cyan-400 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

            {/* Header */}
            <div className="text-center mb-8 relative z-10">

                <h1 className="text-4xl font-bold text-blue-300 mb-3 drop-shadow-[0_0_15px_rgba(147,197,253,0.8)] animate-pulse">
                    Desafio 1 – Inicio da Jornada
                </h1>

                <p className="text-lg text-blue-200">
                    Aprende os conceitos básicos de POO
                </p>
            </div>

            {/* Progress Bar */}
            <div className="w-full max-w-3xl bg-blue-950/50 backdrop-blur-sm h-2 rounded-full mb-8 overflow-hidden shadow-inner relative z-10">
                <div
                    className="bg-gradient-to-r from-blue-400 via-cyan-400 to-green-400 h-full transition-all duration-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]"
                    style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                />
            </div>

            {/* Question Card */}
            <div
                className={`w-full max-w-3xl bg-slate-900/80 backdrop-blur-sm border-4 border-blue-400 rounded-2xl p-8 shadow-[0_0_40px_rgba(59,130,246,0.4)] relative z-10 transition-all duration-700 ease-out ${contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`} >
                <div className="text-green-400 text-sm mb-3 font-semibold">
                    Pergunta {currentQuestion + 1} de {questions.length}
                </div>

                <h2 className="text-2xl text-white mb-6 leading-relaxed font-semibold">
                    {currentQ.question}
                </h2>

                {currentQ.type === 'choice' ? (
                    <div className="flex flex-col gap-4 mb-8">
                        {currentQ.options.map((option, idx) => (
                            <div
                                key={idx}
                                onClick={() => handleChoiceClick(option)}
                                className={`bg-slate-800/80 backdrop-blur-sm border-2 rounded-xl p-5 cursor-pointer transition-all ${answers[currentQuestion] === option
                                    ? 'border-blue-400 bg-blue-900/50 shadow-[0_0_20px_rgba(59,130,246,0.5)]'
                                    : 'border-slate-600 hover:border-blue-300 hover:bg-slate-800'
                                    }`}
                            >
                                <pre className="text-green-400 text-lg m-0 font-mono">{option.text}</pre>
                            </div>
                        ))}
                    </div>
                ) : (
                    <>
                        {/* Draggable Terms */}
                        <div className="mb-8">
                            <h3 className="text-blue-300 text-lg mb-4 font-semibold">📦 Arrasta daqui:</h3>
                            <div className="flex flex-wrap gap-3">
                                {currentQ.pairs.map((pair) => {
                                    const isUsed = Object.values(answers[currentQuestion] || {}).includes(pair.term);
                                    return (
                                        <div
                                            key={pair.id}
                                            draggable={!isUsed}
                                            onDragStart={(e) => handleDragStart(e, pair)}
                                            className={`bg-blue-500 text-white px-5 py-3 rounded-lg font-bold text-base transition-all select-none shadow-[0_4px_12px_rgba(59,130,246,0.4)] ${isUsed
                                                ? 'opacity-30 cursor-not-allowed'
                                                : 'cursor-grab active:cursor-grabbing hover:scale-105 hover:bg-blue-400 hover:shadow-[0_6px_20px_rgba(59,130,246,0.6)]'
                                                }`}
                                        >
                                            {pair.term}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Drop Zones */}
                        <div className="mb-8">
                            <h3 className="text-blue-300 text-lg mb-4 font-semibold">🎯 Solta aqui:</h3>
                            {currentQ.pairs.map((pair) => (
                                <div
                                    key={pair.id}
                                    onDragOver={handleDragOver}
                                    onDrop={(e) => handleDrop(e, pair.definition)}
                                    className="bg-slate-800/60 backdrop-blur-sm border-2 border-dashed border-blue-400 rounded-lg p-5 min-h-[80px] mb-4 flex items-center justify-between transition-all hover:border-blue-300 hover:bg-slate-800/80"
                                >
                                    <span className="text-blue-200 text-lg flex-1">
                                        {pair.definition}
                                    </span>
                                    {answers[currentQuestion]?.[pair.definition] && (
                                        <span
                                            onClick={() => removeDroppedItem(pair.definition)}
                                            className="bg-green-500 text-white px-4 py-2 rounded-md font-bold text-base cursor-pointer hover:bg-green-400 transition-all select-none shadow-[0_2px_10px_rgba(34,197,94,0.4)]"
                                            title="Clica para remover"
                                        >
                                            {answers[currentQuestion][pair.definition]} ✕
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {/* Feedback */}
                {feedback && (
                    <div className={`px-4 py-4 rounded-lg mb-5 text-lg text-center font-bold ${feedback.includes('✨')
                        ? 'bg-green-500/20 border-2 border-green-400 text-green-400 shadow-[0_0_15px_rgba(34,197,94,0.3)]'
                        : 'bg-red-500/20 border-2 border-red-400 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.3)]'
                        }`}>
                        {feedback}
                    </div>
                )}

                {/* Hint */}
                {showHint && (
                    <div className="bg-yellow-500/20 border-2 border-yellow-400 rounded-lg px-4 py-4 mb-5 text-base text-yellow-300 leading-relaxed animate-[slideDown_0.3s_ease] shadow-[0_0_15px_rgba(250,204,21,0.3)]">
                        {currentQ.hint}
                    </div>
                )}

                {/* Next Button */}
                <button
                    onClick={checkAnswer}
                    disabled={!canProceed()}
                    className={`w-full bg-gradient-to-r from-blue-500 to-green-500 text-white font-bold text-xl px-4 py-4 rounded-xl shadow-[0_8px_20px_rgba(59,130,246,0.5)] transition-all ${!canProceed()
                        ? 'opacity-50 cursor-not-allowed'
                        : 'hover:scale-[1.02] hover:shadow-[0_12px_30px_rgba(59,130,246,0.6)] active:scale-[0.98]'
                        }`}
                >
                    {currentQuestion === questions.length - 1 ? '🏁 Finalizar' : '➡️ Próxima'}
                </button>
            </div>
        </div>
    );
};
