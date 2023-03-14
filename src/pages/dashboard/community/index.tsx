import { ReactElement } from "react"
import DashboardLayout from "../../../../layout/DashboardLayout/DashboardLayout"
import useFirebaseFirestore from "../../../../hooks/useFirebaseFirestore"
import QuizLink from "../../../../component/QuizLink/QuizLink"
import styles from './Community.module.css'
import { AnimatePresence, Reorder, useDragControls } from "framer-motion"

const Community = () => {
    const { getLatest, quizzes } = useFirebaseFirestore()
    const controls = useDragControls()

    return (<main className={styles.Community}>
        <div>
            <h1 className="heading">Take a quiz.</h1>
            <p className="subheading">Try our most recent submissions, top rated, or a subject of your choice.</p>
        </div>
        {/* <button onClick={() => {getLatest(1)} }>Get Latest 1</button>
        <button onClick={() => {getLatest(2)} }>Get Latest 2</button>
        <button onClick={() => {getLatest(10)} }>Get Latest 10</button> */}
        <div className={styles.QuizContainer}>
            { quizzes && quizzes.map((q: any, key: any) => (
                <QuizLink key={key} question={q.question} onPointerDown={(e: any) => controls.start(e)} />
            )) }
        </div>
    </main>)
}

Community.getLayout = function getLayout(page: ReactElement) {
    return (
        <DashboardLayout>
            {page}
        </DashboardLayout>
    )
}

export default Community