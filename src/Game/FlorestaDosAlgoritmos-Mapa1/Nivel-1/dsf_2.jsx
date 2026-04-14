import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import RightSideBar from "../Components/SideBars/rightSideBar"
import LeftSideBar from "../Components/SideBars/LeftSideBar"

import QuizContainer from "../Components/Quiz/QuizContainer"
import QuestionCard from "../Components/Quiz/QuestionCard"
import { useQuiz } from "../../Hooks/useQuiz"
import Result from "../Components/Result"

import { getToken, getUser } from "../../../Services/auth/authStorage";
import { getLevelsByMap } from "../../../Services/maps/levelService"
import Bg from "../../../assets/Maps/Bg-Map1.png"


const Dsf2 = {
  titulo: "Desafio 2",
  streak: 3,
  perguntas: [
    {
      id: 1,
      texto: "Essa aqui é a primeira pergunta",
      opcoes: [
        { id: "a", label: "def construtor(self)" },
        { id: "b", label: "def __init__(self, marca, modelo)" },
        { id: "c", label: "function __init__(self)" },
        { id: "d", label: "def __str__(self)" },
      ],
      correctId: "b",
    },
    {
      id: 2,
      texto: "O que é 'self' em Python?",
      opcoes: [
        { id: "a", label: "Uma variável global" },
        { id: "b", label: "O nome da classe" },
        { id: "c", label: "Referência ao objeto atual" },
        { id: "d", label: "Um parâmetro opcional" },
      ],
      correctId: "c",
    },
    {
      id: 3,
      texto: "Qual método retorna a representação em string?",
      opcoes: [
        { id: "a", label: "def __str__(self)" },
        { id: "b", label: "def toString(self)" },
        { id: "c", label: "def __init__(self)" },
        { id: "d", label: "def repr(self)" },
      ],
      correctId: "a",
    },
    {
      id: 4,
      texto: "Como se cria um objeto da classe Veículo?",
      opcoes: [
        { id: "a", label: "Veículo.criar('Ford', 'Ka')" },
        { id: "b", label: "new Veículo('Ford', 'Ka')" },
        { id: "c", label: "meu_carro = Veículo('Ford', 'Ka')" },
        { id: "d", label: "Veículo.instanciar()" },
      ],
      correctId: "c",
    },
    {
      id: 5,
      texto: "Onde ficam os atributos de um objeto?",
      opcoes: [
        { id: "a", label: "Dentro do __str__" },
        { id: "b", label: "Fora da classe" },
        { id: "c", label: "No __init__, usando self" },
        { id: "d", label: "Em variáveis globais" },
      ],
      correctId: "c",
    },
  ]
}



export default function DSF2() {
  const [levels, setLevels] = useState([])
  const [desafioId, setDesafioId] = useState(null)
  const bgDim = (0.55)

  console.log("desafioId:", desafioId);

  const Navigate = useNavigate()

  const token = getToken();
  const userId = getUser();

  const mapaId = 1

  useEffect(() => {
    async function loadLevels() {
      const data = await getLevelsByMap(mapaId);
      setLevels(data);

      setDesafioId(data[1]?.id);
    }

    loadLevels();
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
    resultadoFinal,
  } = useQuiz(Dsf2.perguntas, {
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
          xpGained: resultadoFinal?.xpGanho?.total ?? correct * 80,
          score: Math.round((correct / totalQuestions) * 100),
          streak: Dsf2.streak,
          quizTitle: Dsf2.titulo,
          desafioCompleto: resultadoFinal?.desafioCompleto ?? false,
          primeiraVez: resultadoFinal?.primeiraVez ?? true,
        }}
        onRepeat={() => window.location.reload()}
        onBackToMap={() => Navigate("/Floresta")}
        onNextChallenge={() => Navigate("/floresta/nivel-1/desafio-3")}
      />
    )
  }

  return (

    <>
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
            children: Dsf2.titulo,
            currentQuestion: currentIndex + 1,   // ✅ dinâmico
            totalQuestions: totalQuestions,
            streak: Dsf2.streak,
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