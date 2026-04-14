import QuizHeader from "./QuizHeader";
import AnswerOptions from "./AnswerOptions";
import QuestionCard from "./QuestionCard";
import QuizResult from "../Result"
import { Children } from "react";

export default function QuizContainer({
    headerProps,
    answerOptionsProps,
    children, 
    
}) 

  {
    return (
        <div className="min-h-screen flex items-center justify-center px-8">
            <div className="w-full max-w-4xl rounded-4xl overflow-hidden">
                <QuizHeader {...headerProps} />

                <div className="p-7 flex flex-col gap-4 ">
                    {children}
                    <AnswerOptions {...answerOptionsProps} />
                </div>
            </div>
        </div>
    );
}