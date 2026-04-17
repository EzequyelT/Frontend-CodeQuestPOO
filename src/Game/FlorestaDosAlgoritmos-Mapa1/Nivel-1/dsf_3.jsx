import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import RightSideBar from "../Components/SideBars/RightSideBar"
import LeftSideBar from "../Components/SideBars/LeftSideBar"

import CodeComponent from "../Components/Code/CodeComponent"
import Result from "../Components/Result"
import { useCode } from "../../Hooks/useCode"
import { getToken, getUser } from "../../../Services/auth/authStorage";

import { getLevelsByMap } from "../../../Services/maps/levelService"
import Bg from "../../../assets/Maps/Bg-Map1.png"
import dsf_3 from "../../Data/Mapa-1/Nivel-1/dsf_3"
import ModalService from '../Components/Modal/ModalService'

import ModalNivelConcluido from "../Components/Modal/LevelModal"

const dsf = dsf_3

const challenge = {
    nome: "Operadores Básicos",
    descricao: "Os operadores são o que permite ao código realizar cálculos e tomar decisões. Aqui vais aprender a usar operações matemáticas e lógicas para manipular valores e resolver problemas simples. Este é o primeiro passo para começares a pensar como um verdadeiro programador.",
    xp: 10,
    nivel: 1,
    dificuldade: "Fácil"
};



export default function DSF3() {

    const [levels, setLevels] = useState([]);
    const [desafioId, setDesafioId] = useState(null);
    const [showModal, setShowModal] = useState(true);
    const [modalNivelConcluido, setModalNivelConcluido] = useState(null);

    const token = getToken()
    const userId = getUser()

    const navigate = useNavigate()
    const bgDim = (0.60)

    const mapaId = 1

    useEffect(() => {
        async function loadLevels() {
            const data = await getLevelsByMap(mapaId);
            setLevels(data);

          setDesafioId(data[2]?.id);
        }

        loadLevels()
    }, [])

    console.log(desafioId)

    const {
        currentQuestion,
        logs,
        currentIndex,
        loading,
        mentorStatus,
        objectives,
        finished,
        runCode,
        addLog,
        timeSeconds,
        correct,
        wrong,
        finalResult,
        saving,
    } = useCode(dsf, {
        token,
        aluno_id: userId,
        desafio_id: desafioId,
        level_Id: levels
    })

    useEffect(() => {
        if (!finished || !finalResult) return;

        // ✅ proteção extra (evita crash)
        if (!finalResult?.primeiraVez) return;

        if (finalResult?.nivelCompleto) {
            setModalNivelConcluido({
                nivelNome: `Nível ${challenge.nivel} Concluído!`,
                xpGanho: finalResult?.xpGanho?.total ?? 0,
                proximoNivel: finalResult?.proximoNivel ?? null,
                nivelMaximo: finalResult?.nivelMaximo ?? false
            });
        }

    }, [finished, finalResult]);

    console.log("FINAL RESULT:", finalResult);


    if (finished && saving) {
        return <div className="text-white text-4xl font-bold">Salvando resultado...</div>
    }

    const score = Math.max(
        0,
        Math.round((correct / (correct + wrong)) * 100)
    )

    if (finished && !saving) {
        console.log("FINAL RESULT:", finalResult)
        return (
            <>
                <Result
                    result={{
                        correct,
                        wrong,
                        timeSeconds,

                        xpGained: finalResult?.xpGanho?.total ?? correct * 80,
                        xpNextLevel: finalResult?.xpProximoNivel ?? 0,
                        nivelAtual: finalResult?.nivel_atual ?? 1,

                        score: score,
                        desafioCompleto: finalResult?.desafioCompleto ?? false,
                        primeiraVez: finalResult?.primeiraVez ?? true,

                    }}
                    onRepeat={() => window.location.reload()}
                    onBackToMap={() => navigate("/Floresta")}
                    onNextChallenge={() => {
                        navigate("/floresta/nivel-2/desafio-4")
                    }}
                />


                {modalNivelConcluido && (
                    <ModalNivelConcluido
                        isOpen={!!modalNivelConcluido}
                        onClose={() => setModalNivelConcluido(null)}
                        onContinuar={() => {
                            setModalNivelConcluido(null);

                            if (modalNivelConcluido?.nivelMaximo) {
                                navigate("/mapa-final");
                            }
                            else if (modalNivelConcluido.proximoNivel) {
                                navigate("/floresta/nivel-2/desafio-4")

                            } else {
                                navigate("/Floresta");
                            }
                        }}
                        nivelNome={modalNivelConcluido.nivelNome}
                        xpGanho={modalNivelConcluido.xpGanho}
                        proximoNivel={modalNivelConcluido.proximoNivel}
                    />
                )}
            </>

        )

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

            <div className="scrollbar"

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
                <CodeComponent
                    key={currentIndex}
                    currentQuestion={currentQuestion}
                    logs={logs}
                    loading={loading}
                    mentorStatus={mentorStatus}
                    objectives={objectives}
                    runCode={runCode}
                    addLog={addLog}
                    hints={currentQuestion?.hints}
                />
            </div>

        </>
    )
}