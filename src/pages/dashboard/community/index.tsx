import { Key, ReactElement, useEffect, useState, useRef } from "react"
import { useRouter } from "next/router"
import { QuizHeader } from "QuizHeaderType"

import DashboardLayout from "../../../../layout/DashboardLayout/DashboardLayout"
import styles from './Community.module.css'

// hooks
import useFirebaseFirestore from "../../../../hooks/useFirebaseFirestore"
import useFirebaseUserContext from "../../../../hooks/useFirebaseUserContext"
import useFirebaseFirestoreContext from "../../../../hooks/useFirebaseFirestoreContext"

import { motion, AnimatePresence, useScroll } from "framer-motion"
import QuizLink from "../../../../component/QuizLink/QuizLink"
import { Formik, Form, Field } from "formik"

import Image from 'next/image'
import waves from '../../../../public/svgs/waves4.svg'

// import useMeasure from "react-use-measure"
// import ignoreCircularReferences from "../../../../lib/ignoreCircularReferences"

const Community = () => {
    const { user } = useFirebaseUserContext()
    const { db, dbUser } = useFirebaseFirestoreContext()
    const { quizHeaders, fetchRecentQuizzes, fetchNextRecentQuizzes, queryQuizzesBySubject } = useFirebaseFirestore()
    // const [ ref, { height } ] = useMeasure()

    // fetch recent quizzes on first mount
    // but we need to make sure db and user are mounted
    const [ hasMounted, setMounted ] = useState<boolean>(false)

    // recall we're in strict mode so this really will generate twice the amount of reads depending on n, we'll leave it at 5 in development
    // handles await requirement for db and user, navigation and refresh
    useEffect(() => {
        if(db && user && dbUser && !hasMounted){
            const fetch = async () => {
                await fetchRecentQuizzes(4)
                .then(() => setMounted(true))
            }
            fetch()
        }
    }, [db, user, dbUser, hasMounted, fetchRecentQuizzes])

    return (<main className={styles.Community}>
        <header>
            <h1 className="heading">Take a quiz.</h1>
            <p className="subheading">Try our most recent submissions, top rated, or a subject of your choice.</p>
            <Formik
                initialValues={{ subject: '' }}
                onSubmit={ async ({subject}: any) => {
                    if (subject.trim() === ''){
                        fetchRecentQuizzes(4)
                    }
                    else {
                        queryQuizzesBySubject(subject)
                    }
                }}
                onReset={()=>console.log("reset")}
            >
            <Form>
                <Field type="text" name="subject" placeholder="Search for a subject"/>
            </Form>
            </Formik>
            <Image src={waves} alt={"Wave background"} />
        </header>

        <AnimatePresence mode="popLayout">
            <motion.div 
                className={styles.QuizContainer} 
            >
                { quizHeaders.length > 0 && quizHeaders.map((header: QuizHeader, key: Key) => (
                    <span key={key}>
                        <QuizLink header={header} idx={key} />
                    </span>
                )) }
            </motion.div>
        </AnimatePresence>
         
        <div className={styles.Temp}>
         <button id="fetch" onClick={()=>{fetchNextRecentQuizzes(2)}}>Load 2 more</button>
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