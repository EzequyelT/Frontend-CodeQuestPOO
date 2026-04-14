import RightSideBar from "../Components/SideBars/rightSideBar"
import LeftSideBar from "../Components/SideBars/LeftSideBar"
import CodeComponent from "../Components/Code/CodeComponent"


export default function DSF3() {
    return (
        <>
            <RightSideBar />
            <LeftSideBar />

            <div>
               <CodeComponent />
            </div>
           
        </>
    )
}