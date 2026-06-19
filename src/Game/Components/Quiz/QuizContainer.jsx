import QuizHeader from "./QuizHeader";
import AnswerOptions from "./AnswerOptions";
import QuestionCard from "./QuestionCard";
import QuizResult from "../Result"
import { Children } from "react";

export default function QuizContainer({
    headerProps,
    answerOptionsProps,
    children,
    transitioning
}) {
    return (
        <div className="min-h-screen flex items-center justify-center px-8">
            <div className="w-full max-w-4xl rounded-4xl overflow-hidden">
                {transitioning && (
                    <div className="absolute inset-10 z-9 flex items-center justify-center">

                        <div className="text-center text-white">

                            <div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>

                            <p className="font-bold text-xl">
                                Próxima pergunta...
                            </p>

                        </div>

                    </div>
                )}
                <QuizHeader {...headerProps} />

                <div
                    className={`
        p-7 flex flex-col gap-4
        transition-all duration-500
        ${transitioning ? "opacity-0 translate-y-2" : "opacity-100"}
      `}
                >
                    {children}
                    <AnswerOptions {...answerOptionsProps} />
                </div>

            </div>
        </div>
    );
}