import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import RightSideBar from "../Components/SideBars/RightSideBar"
import LeftSideBar from "../Components/SideBars/LeftSideBar"

import QuizContainer from "../Components/Quiz/QuizContainer"
import QuestionCard from "../Components/Quiz/QuestionCard"
import { useQuiz } from "../../Hooks/useQuiz"
import Result from "../Components/Result"

import { getToken, getUser } from "../../../Services/auth/authStorage";
import { getLevelsByMap } from "../../../Services/maps/levelService"
import Bg from "../../../assets/Maps/Bg-Map1-Nivel-2.jpg"
import dsf_4 from "../../Data/Mapa-1/Nivel-2/dsf_4"
import ModalService from '../Components/Modal/ModalService'

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

        if (data?.[1]?.desafios?.length > 0) {
          setDesafioId(data[1].desafios[0].id)
        }
      }

      loadLevels();
    } catch (err) {
      console.error("Erro ao buscar desafio", err)
      throw (err)
    }

  }, []);

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
  } = useQuiz(dsf.perguntas, {
    token: token,
    aluno_id: userId,
    desafio_id: desafioId,
    level_Id: levels
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
          score: Math.round((correct / totalQuestions) * 100),
          streak: dsf.streak,
          quizTitle: dsf.titulo,
          desafioCompleto: finalResult?.desafioCompleto ?? false,
          primeiraVez: finalResult?.primeiraVez ?? true,
        }}
        onRepeat={() => window.location.reload()}
        onBackToMap={() => Navigate("/Floresta")}
        onNextChallenge={() => Navigate("/floresta/nivel-2/desafio-5")}
      />
    )
  }

  if (!desafioId) {
    return <div>Carregando...</div>;
  }

  return (

    <>
      <ModalService
        isOpen={showModal}
        setIsOpen={setShowModal}
        challenge={challenge}
      />

      <RightSideBar time={timeSeconds} />
      <LeftSideBar />

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
          headerProps={{
            children: dsf.titulo,
            currentQuestion: currentIndex + 1,   // ✅ dinâmico
            totalQuestions: totalQuestions,
            streak: dsf.streak,
          }}
          answerOptionsProps={{
            options: currentQuestion.opcoes,
          }}
        >
          {/* 1 slot único por pergunta */}
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