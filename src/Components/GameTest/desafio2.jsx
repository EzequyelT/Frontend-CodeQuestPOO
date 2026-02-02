import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom"
import { IoExitOutline } from "react-icons/io5";
import Bg from "../../Assets/GameTest/Bgdesafio1e2.jpg";


export default function Desafio2GameTest() {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [feedback, setFeedback] = useState('');
    const [showResult, setShowResult] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [showHint, setShowHint] = useState(false);
    const [contentVisible, setContentVisible] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => setContentVisible(true), 1500);
        return () => clearTimeout(t);
    }, []);

    const questions = [
        {
            id: 1,
            code: `class Dragao:
    def __init__(self, nome):
        self.nome = nome

d = Dragao("Caos")`,
            question: "O objeto `d` é uma instância da classe `Dragao`?",
            correctAnswer: true,
            hint: "💡 Dica: Quando fazemos Dragao('Caos'), estamos a criar um novo objeto/instância da classe Dragao.",
            explanation: "Correto! O objeto `d` é uma instância da classe `Dragao`, criada através do construtor __init__."
        },
        {
            id: 2,
            code: `class Heroi:
    vida = 100
    
    def atacar(self):
        return "Ataque!"

h1 = Heroi()
h2 = Heroi()`,
            question: "`h1` e `h2` partilham o mesmo atributo `vida`?",
            correctAnswer: true,
            hint: "💡 Dica: O atributo `vida` foi definido fora do __init__, tornando-o um atributo de classe (partilhado por todas as instâncias).",
            explanation: "Verdadeiro! Como `vida` é um atributo de classe (definido fora do __init__), ele é partilhado entre todas as instâncias."
        },
        {
            id: 3,
            code: `class Guerreiro:
    def __init__(self, nome):
        self.nome = nome
        self.vida = 100

g = Guerreiro("Arthas")
print(g.vida)`,
            question: "Este código vai imprimir `100`?",
            correctAnswer: true,
            hint: "💡 Dica: No __init__, definimos self.vida = 100. Quando criamos o objeto g, ele terá esse atributo.",
            explanation: "Correto! O atributo `vida` é inicializado com o valor 100 no construtor, portanto g.vida será 100."
        },
        {
            id: 4,
            code: `class Mago:
    def __init__(self):
        self.mana = 50

m = Mago()
m.mana = 80`,
            question: "Após executar este código, `m.mana` terá o valor `50`?",
            correctAnswer: false,
            hint: "💡 Dica: Podemos alterar o valor de um atributo após criar o objeto. A linha m.mana = 80 faz exatamente isso!",
            explanation: "Falso! Inicialmente m.mana é 50, mas depois alteramos para 80. O valor final será 80."
        },
        {
            id: 5,
            code: `class Elfo:
    def __init__(self, nome):
        self.nome = nome
    
    def saudar(self):
        return f"Olá, sou {self.nome}"

e = Elfo("Legolas")`,
            question: "`saudar` é um método de instância da classe `Elfo`?",
            correctAnswer: true,
            hint: "💡 Dica: Um método de instância é uma função dentro da classe que recebe 'self' como primeiro parâmetro.",
            explanation: "Verdadeiro! O método saudar() está dentro da classe e recebe self, tornando-o um método de instância."
        },
        {
            id: 6,
            code: `class Orc:
    forca = 10
    
o1 = Orc()
o2 = Orc()
o1.forca = 20`,
            question: "Após alterar `o1.forca`, o valor de `o2.forca` também será `20`?",
            correctAnswer: false,
            hint: "💡 Dica: Quando atribuímos um valor a o1.forca, criamos um atributo de instância que sobrepõe o atributo de classe apenas para o1.",
            explanation: "Falso! Ao fazer o1.forca = 20, criamos um atributo de instância para o1. O o2 continua a usar o atributo de classe (10)."
        },
        {
            id: 7,
            code: `class Archer:
    def __init__(self, nome):
        nome = nome

a = Archer("Robin")
print(a.nome)`,
            question: "Este código vai funcionar sem erros?",
            correctAnswer: false,
            hint: "💡 Dica: Esquecemo-nos de usar 'self.' antes de nome no __init__. Sem isso, o atributo não é guardado no objeto!",
            explanation: "Falso! O código vai dar erro porque nos esquecemos do 'self.' - deveria ser self.nome = nome. Sem isso, o atributo não existe no objeto."
        }
    ];

    const currentQ = questions[currentQuestion];
    const navigate = useNavigate();

    const handleAnswer = (answer) => {
        setSelectedAnswer(answer);
    };

    const checkAnswer = () => {
        const isCorrect = selectedAnswer === currentQ.correctAnswer;

        if (isCorrect) {
            setScore(score + 1);
            setFeedback(`✨ ${currentQ.explanation}`);
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
                setSelectedAnswer(null);
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
        setSelectedAnswer(null);
        setShowHint(false);
    };

    if (showResult) {
        const percentage = (score / questions.length) * 100;
        let message = '';
        if (percentage === 100) {
            message = '🏆 Perfeito! Dominas a leitura de código OOP!';
        } else if (percentage >= 70) {
            message = '⚔️ Muito bom! Já consegues interpretar código!';
        } else if (percentage >= 50) {
            message = '🌟 Bom início! Continua a praticar!';
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
                {/* Animated background elements */}
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
        >            <button
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
                <h1 className="text-4xl font-bold text-blue-300 mb-3 drop-shadow-[0_0_15px_rgba(147,197,253,0.8)]">
                    📖 Quiz de Leitura de Código
                </h1>
                <p className="text-lg text-blue-200">Analisa o código e responde Verdadeiro ou Falso</p>
            </div>

            {/* Progress Bar */}
            <div className="w-full max-w-4xl bg-blue-950/50 backdrop-blur-sm h-2 rounded-full mb-8 overflow-hidden shadow-inner relative z-10">
                <div
                    className="bg-gradient-to-r from-blue-400 via-cyan-400 to-green-400 h-full transition-all duration-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]"
                    style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                />
            </div>

            {/* Question Card */}
            <div className={`w-full max-w-4xl bg-slate-900/80 backdrop-blur-sm border-4 border-blue-400 rounded-2xl p-8 shadow-[0_0_40px_rgba(59,130,246,0.4)] relative z-10 transition-all duration-700 ease-out ${contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
                <div className="text-green-400 text-sm mb-3 font-semibold">
                    Pergunta {currentQuestion + 1} de {questions.length}
                </div>

                {/* Code Block */}
                <div className="bg-slate-950/90 border-2 border-slate-700 rounded-xl p-6 mb-6 shadow-inner">
                    <div className="flex items-center gap-2 mb-3 pb-3 border-b border-slate-700">
                        <div className="flex gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-red-500"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        </div>
                        <span className="text-xs text-slate-400 ml-2">Python</span>
                    </div>
                    <pre className="text-green-400 text-base leading-relaxed overflow-x-auto">
                        <code>{currentQ.code}</code>
                    </pre>
                </div>

                <h2 className="text-2xl text-white mb-8 leading-relaxed font-semibold">
                    {currentQ.question}
                </h2>

                {/* True/False Buttons */}
                <div className="grid grid-cols-2 gap-6 mb-8">
                    <button
                        onClick={() => handleAnswer(true)}
                        className={`py-8 px-6 rounded-xl font-bold text-2xl transition-all border-4 ${selectedAnswer === true
                            ? 'bg-green-500/30 border-green-400 shadow-[0_0_25px_rgba(34,197,94,0.5)] scale-105'
                            : 'bg-slate-800/60 border-slate-600 hover:border-green-400 hover:bg-slate-800'
                            }`}
                    >
                        <div className="text-4xl mb-2">✔️</div>
                        <div className="text-green-400">Verdadeiro</div>
                    </button>

                    <button
                        onClick={() => handleAnswer(false)}
                        className={`py-8 px-6 rounded-xl font-bold text-2xl transition-all border-4 ${selectedAnswer === false
                            ? 'bg-red-500/30 border-red-400 shadow-[0_0_25px_rgba(239,68,68,0.5)] scale-105'
                            : 'bg-slate-800/60 border-slate-600 hover:border-red-400 hover:bg-slate-800'
                            }`}
                    >
                        <div className="text-4xl mb-2">❌</div>
                        <div className="text-red-400">Falso</div>
                    </button>
                </div>

                {/* Feedback */}
                {feedback && (
                    <div className={`px-5 py-4 rounded-lg mb-5 text-base text-left leading-relaxed ${feedback.includes('✨')
                        ? 'bg-green-500/20 border-2 border-green-400 text-green-300 shadow-[0_0_15px_rgba(34,197,94,0.3)]'
                        : 'bg-red-500/20 border-2 border-red-400 text-red-300 shadow-[0_0_15px_rgba(239,68,68,0.3)]'
                        }`}>
                        {feedback}
                    </div>
                )}

                {/* Hint */}
                {showHint && (
                    <div className="bg-yellow-500/20 border-2 border-yellow-400 rounded-lg px-5 py-4 mb-5 text-sm text-yellow-300 leading-relaxed animate-[slideDown_0.3s_ease] shadow-[0_0_15px_rgba(250,204,21,0.3)]">
                        {currentQ.hint}
                    </div>
                )}

                {/* Next Button */}
                <button
                    onClick={checkAnswer}
                    disabled={selectedAnswer === null}
                    className={`w-full bg-gradient-to-r from-blue-500 to-green-500 text-white font-bold text-xl px-4 py-4 rounded-xl shadow-[0_8px_20px_rgba(59,130,246,0.5)] transition-all ${selectedAnswer === null
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
