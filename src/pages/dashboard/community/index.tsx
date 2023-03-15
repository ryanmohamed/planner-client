import { ReactElement } from "react"
import DashboardLayout from "../../../../layout/DashboardLayout/DashboardLayout"
import useFirebaseFirestore from "../../../../hooks/useFirebaseFirestore"
import QuizLink from "../../../../component/QuizLink/QuizLink"
import styles from './Community.module.css'
import { motion, AnimatePresence, Reorder, useDragControls, MotionConfig } from "framer-motion"

import Image from 'next/link'

const Community = () => {
    const { getLatest, quizzes } = useFirebaseFirestore()
    const controls = useDragControls()

    return (<main className={styles.Community}>
        <header>
            <h1 className="heading">Take a quiz.</h1>
            <p className="subheading">Try our most recent submissions, top rated, or a subject of your choice.</p>
            <input type="search" placeholder="Search for a subject"/>
            <img src="/svgs/waves4.svg" />
        </header>

        <div className={styles.Landing}>
            <h1> Check out the latest quizzes </h1>
            <p> Currently viewing most recent 
                <select name="numQuizzes" onChange={ async (e) => {
                    await getLatest(Number(e.target.value))
                }}>
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="20">20</option>
                </select>
            </p>
        </div>

        {/* <button onClick={() => {getLatest(1)} }>Get Latest 1</button>
        <button onClick={() => {getLatest(2)} }>Get Latest 2</button>
        <button onClick={() => {getLatest(10)} }>Get Latest 10</button> */}
        

        
        <MotionConfig transition={{ duration: 0.5 }}>
            <motion.div className={styles.QuizContainer} layout>
                <AnimatePresence mode="wait">
                { quizzes && quizzes.map(({id, data}: any, key: any) => (
                    <QuizLink key={key} id={id} question={data.question} onPointerDown={(e: any) => controls.start(e)} />
                )) }
                </AnimatePresence>
            </motion.div>
        </MotionConfig>

            
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