import RightSideBar from "../Components/rightSideBar";
import LeftSideBar from "../Components/LeftSideBar";
import QuizContainer from "../Components/Quiz/QuizContainer";
import QuestionCard from "../Components/Quiz/QuestionCard";



export default function DSF1() {
    const questionCardProps = [
        {
            label: "Resposta 1",
            children: "Arraste a resposta para cá",
            onDrop: (data) => console.log("Resposta 1:", data),
        },
        {
            label: "Resposta 2",
            children: "Arraste a resposta para cá",
            onDrop: (data) => console.log("Resposta 2:", data),
        },
         {
            label: "Resposta 3",
            children: "Arraste a resposta para cá",
            onDrop: (data) => console.log("Resposta 2:", data),
        },
      
    ];



    return (

        <>
            <RightSideBar />
            <LeftSideBar />

            <div className="flex flex-col">
                <QuizContainer
                    headerProps={{
                        children: "Quiz Interativo – Classe Veículo",
                        currentQuestion: 1,
                        totalQuestions: 5,
                        streak: 4,
                    }}
                    answerOptionsProps={{
                        options: [
                            { id: 1, label: "def __init__(self, marca, modelo)" },
                            { id: 2, label: "def __str__(self)" },
                            { id: 3, label: "self.marca" },
                            { id: 4, label: "self.local" },
                            { id: 5, label: "self.informal" },
                        ],
                        onDragStart: (item) => console.log("drag:", item),
                    }}
                >
                    <div className="flex flex-wrap gap-8 mr-20 justify-center">
                        {questionCardProps.map((props, index) => (
                            <QuestionCard key={index} {...props} />
                        ))}
                    </div>
                </QuizContainer>
            </div>

        </>
    )
}