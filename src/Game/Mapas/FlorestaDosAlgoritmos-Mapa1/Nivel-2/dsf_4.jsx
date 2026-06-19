import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import RightSideBar from "../../../Components/SideBars/RightSideBar"
import LeftSideBar from "../../../Components/SideBars/LeftSideBar"

import QuizContainer from "../../../Components/Quiz/QuizContainer"
import QuestionCard from "../../../Components/Quiz/QuestionCard"
import { useQuiz } from "../../../Hooks/useQuiz"
import Result from "../../../Components/Result"

import { getToken, getUser } from "../../../../Services/auth/authStorage";
import { getLevelsByMap } from "../../../../Services/maps/levelService"
import { getProgressoDashboard } from "../../../../Services/users/userStatsService"
import Bg from "../../../../assets/Maps/Bg-Map1-Nivel-2.jpg"
import dsf_4 from "../../../Data/Mapa-1/Nivel-2/dsf_4"

import ModalService from '../../../Components/Modal/ModalService'
import ModalFalha from '../../../Components/Modal/ModalFalha'

import loadingVideo from "../../../../assets/Loading/loading.webm";

const dsf = dsf_4

const challenge = {
  nome: "If e else",
  descricao:
    "As estruturas de decisão como if, else e elif permitem controlar o fluxo do programa com base em condições. Neste desafio vais aprender a fazer o código tomar decisões diferentes dependendo dos valores recebidos, criando lógica mais inteligente e dinâmica. Estas estruturas são fundamentais para programas que reagem a diferentes situações.",
  xp: 10,
  nivel: 2,
  dificuldade: "Fácil",
};

export default function DSF4() {
  const [levels, setLevels] = useState([])
  const [desafioId, setDesafioId] = useState(null)
  const [showModal, setShowModal] = useState(true);
  const [initialStreak, setInitialStreak] = useState(0);
  const [loading, setLoading] = useState(true);


  const bgDim = (0.55)

  const Navigate = useNavigate()

  const token = getToken();
  const userId = getUser();

  const mapaId = 1

  useEffect(() => {
    try {
      async function loadLevels() {
        const data = await getLevelsByMap(mapaId);
        setLevels(data);
        setLoading(false);

        if (data?.[1]?.desafios?.length > 0) {
          setDesafioId(data[1].desafios[0].id)
        }
      }

      async function loadStats() {
        if (!token) return;
        const stats = await getProgressoDashboard(token);
        setInitialStreak(stats.streak || 0);
      }

      loadLevels();
      loadStats();
    } catch (err) {
      console.error("Erro ao buscar desafio", err)
      throw (err)
    }

  }, [token]);

  const {
    currentQuestion,
    currentIndex,
    currentResponse,
    correct,
    wrong,
    timeSeconds,
    finished,
    totalQuestions,
    response,
    resetSlot,
    finalResult,
    resetQuiz,
    showFailModal,
    streakAtual,
    transitioning
  } = useQuiz(dsf.perguntas, {
    token: token,
    aluno_id: userId,
    desafio_id: desafioId,
    level_Id: levels,
    streakInicial: initialStreak,
  })

  if (finished) {
    return (
      <Result
        result={{
          correct,
          wrong,
          timeSeconds,
          hintsUsed: 0,
          xpGained: finalResult?.xpGanho?.total ?? correct * 80,
          coinsGained: finalResult?.coinsGanhos?.total ?? correct * 10,
          score: Math.round((correct / totalQuestions) * 100),
          streak: streakAtual,
          quizTitle: dsf.titulo,
          desafioCompleto: finalResult?.desafioCompleto ?? false,
          primeiraVez: finalResult?.primeiraVez ?? true,
        }}
        onRepeat={() => window.location.reload()}
        onBackToMap={() => Navigate("/FlorestaDosAlgoritmos")}
        onNextChallenge={() => Navigate("/floresta/nivel-2/desafio-5")}
      />
    )
  }

  if (loading) {
    return (
      <div className="relative min-h-screen bg-[#000000] flex flex-col items-center justify-center overflow-hidden select-none">
        <div className="flex flex-col items-center gap-6 z-10">

          <div className="relative w-40 h-40 flex items-center justify-center p-2 bg-[#080808]/50 rounded-xl">
            <video
              src={loadingVideo}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-contain"
            />
          </div>

          <div className="flex flex-col items-center gap-3 mt-2">
            <p className="text-white text-sm font-semibold tracking-[0.3em] uppercase animate-pulse">
              Carregando
            </p>

            <div className="flex gap-1.5 justify-center">
              {[0, 0.2, 0.4].map((delay, i) => (
                <div
                  key={i}
                  className="w-1 h-1 rounded-full bg-amber-500/80"
                  style={{
                    animation: `dot-pulse 1.4s ease-in-out infinite`,
                    animationDelay: `${delay}s`
                  }}
                />
              ))}
            </div>
          </div>

        </div>
      </div>
    );
  }

  return (

    <>
      <ModalService
        isOpen={showModal}
        setIsOpen={setShowModal}
        challenge={challenge}
      />

      {showFailModal && (
        <ModalFalha
          isOpen={true}
          onRepetir={resetQuiz}
          onVoltar={() => Navigate("/FlorestaDosAlgoritmos")}
          correct={correct}
          wrong={wrong}
          time={timeSeconds}
        />
      )}

      <RightSideBar time={timeSeconds} wrong={wrong} />
      <LeftSideBar streak={streakAtual} />

      <div className="flex flex-col"
        style={{
          backgroundImage: `
           linear-gradient(rgba(0,0,0,${bgDim}), rgba(0,0,0,${bgDim})),
           url(${Bg})
           `,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <QuizContainer
          transitioning={transitioning}
          headerProps={{
            children: dsf.titulo,
            currentQuestion: currentIndex + 1,   
            totalQuestions: totalQuestions,
            streak: dsf.streak,
          }}
          answerOptionsProps={{
            options: currentQuestion.opcoes,
          }}
        >
          <div className="flex justify-center">
            <QuestionCard
              label="Arraste a resposta correta"
              pergunta={currentQuestion.texto}
              dropped={currentResponse}
              onDrop={(item) => response(item)}
              onReset={resetSlot}
            />
          </div>

        </QuizContainer>
      </div>
    </>
  )
}