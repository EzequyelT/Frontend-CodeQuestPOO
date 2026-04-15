import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import RightSideBar from "../Components/SideBars/rightSideBar"
import LeftSideBar from "../Components/SideBars/LeftSideBar"

import CodeComponent from "../Components/Code/CodeComponent"
import Result from "../Components/Result"
import { useCode } from "../../Hooks/useCode"
import { getToken, getUser } from "../../../Services/auth/authStorage";

import { getLevelsByMap } from "../../../Services/maps/levelService"
import Bg from "../../../assets/Maps/Bg-Map1.png"
import dsf_3 from "../../Data/Mapa-1/Nivel-1/dsf_3"

const dsf = dsf_3

export default function DSF3() {

    const [levels, setLevels] = useState([]);
    const [desafioId, setDesafioId] = useState(null);

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

    const {
        currentQuestion,
        logs,
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

    if (finished && saving) {
        return <div>Salvando resultado...</div>
    }

    const score = Math.max(
        0,
        Math.round((correct / (correct + wrong)) * 100)
    )

    if (finished && !saving) {
        console.log("FINAL RESULT:", finalResult)
        return (

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
        )
    }

    return (
        <>

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
                    currentQuestion={currentQuestion}
                    logs={logs}
                    loading={loading}
                    mentorStatus={mentorStatus}
                    objectives={objectives}
                    runCode={runCode}
                    addLog={addLog}
                />
            </div>

        </>
    )
}