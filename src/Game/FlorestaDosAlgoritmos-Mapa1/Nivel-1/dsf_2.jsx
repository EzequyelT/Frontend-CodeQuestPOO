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
import Bg from "../../../assets/Maps/Bg-Map1.png"
import dsf_2 from "../../Data/Mapa-1/Nivel-1/dsf_2"

import ModalService from '../Components/Modal/ModalService'
import ModalFalha from '../Components/Modal/ModalFalha'

const dsf = dsf_2

const challenge = {
  nome: "Tipos de Dados",
  descricao: "Nem toda a informação é igual na programação e , neste desafio ,  vais aprender a identificar diferentes tipos de dados, como números, texto e valores lógicos. Saber distingui-los é essencial para evitar erros e criar programas mais organizados e eficientes.",
  xp: 10,
  nivel: 1,
  dificuldade: "Fácil"
};

export default function DSF2() {
  const [levels, setLevels] = useState([])
  const [desafioId, setDesafioId] = useState(null)
  const [showModal, setShowModal] = useState(true);

  const bgDim = (0.55)

  console.log("desafioId:", desafioId);

  const Navigate = useNavigate()

  const token = getToken();
  const userId = getUser();

  const mapaId = 1

  useEffect(() => {

    try {
      async function loadLevels() {
        const data = await getLevelsByMap(mapaId);
        setLevels(data);

        setDesafioId(data[1]?.id);
      }

      loadLevels();
    } catch (err) {
      console.error(err)
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
    resetQuiz,
    showFailModal,
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
        onBackToMap={() => Navigate("/FlorestaDosAlgoritmos")}
        onNextChallenge={() => Navigate("/floresta/nivel-1/desafio-3")}
      />
    )
  }

  return (
    <>

      <ModalService
        isOpen={showModal}
        setIsOpen={setShowModal}
        challenge={challenge}
        time={timeSeconds}
      />

      <RightSideBar time={timeSeconds} wrong={wrong} />
      <LeftSideBar />

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
            options: currentQuestion.opcoes,        // ✅ opções da pergunta atual
          }}
        >
          {/* 1 slot único por pergunta */}
          <div className="flex justify-center">
            <QuestionCard
              label="Arraste a resposta correta"
              pergunta={currentQuestion.texto}
              dropped={currentResponse}            // ✅ estado controlado pelo hook
              onDrop={(item) => response(item)} // ✅ chama o hook
              onReset={resetSlot}                // ✅ chama o hook
            />
          </div>

        </QuizContainer>
      </div>
    </>
  )
}