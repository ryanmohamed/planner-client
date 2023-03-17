import { ReactElement, useEffect } from "react"
import DashboardLayout from "../../../../layout/DashboardLayout/DashboardLayout"
import useFirebaseFirestore from "../../../../hooks/useFirebaseFirestore"
import QuizLink from "../../../../component/QuizLink/QuizLink"
import styles from './Community.module.css'
import { motion, AnimatePresence, Reorder, useDragControls, MotionConfig } from "framer-motion"

import Image from 'next/link'
import useMeasure from "react-use-measure"
import ignoreCircularReferences from "../../../../lib/ignoreCircularReferences"

const Community = () => {
    const { getLatest, quizzes } = useFirebaseFirestore()
    const controls = useDragControls()
    const [ ref, { height } ] = useMeasure()

    useEffect(() => {
        getLatest(5)
    }, [])

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
                    getLatest(Number(e.target.value))
                }}>
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="20">20</option>
                </select>
            </p>
        </div>

        <AnimatePresence mode="wait">s
            <motion.div 
                className={styles.QuizContainer} 
            >
                {quizzes && quizzes.map(({id, data}: any, key: any) => (
                    <QuizLink id={id} data={data} key={id} />
                )) }
            </motion.div>
        </AnimatePresence>
            
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