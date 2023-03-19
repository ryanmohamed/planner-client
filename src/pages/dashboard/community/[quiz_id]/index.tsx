import { useEffect, useState, ReactElement} from 'react'
import { useRouter } from 'next/router'
import { QuizData } from 'QuizData'

import { Formik, FieldArray } from 'formik'
import * as Yup from 'yup'

import useFirebaseFirestore from '../../../../../hooks/useFirebaseFirestore'
import useFirebaseUserContext from '../../../../../hooks/useFirebaseUserContext'

import DashboardLayout from '../../../../../layout/DashboardLayout/DashboardLayout'
import Question from '../../../../../component/Question/Question'

import { Rating } from '@smastrom/react-rating'

import styles from './QuizPage.module.css'

import { AnimatePresence, motion } from 'framer-motion'
import useFirebaseFirestoreContext from '../../../../../hooks/useFirebaseFirestoreContext'


const QuizPage = () => {
    const router = useRouter()
    const { user } = useFirebaseUserContext()
    const { db, dbUser } = useFirebaseFirestoreContext()
    const { fetchQuizById, submitAnswers, submitRating } = useFirebaseFirestore()

    // state
    const [ quiz, setQuiz ] = useState<any>(null)
    const [ error, setError ] = useState<any>(null)
    const [ start, setStart ] = useState<boolean>(false)
    
    const [ score, setScore ] = useState<any>(null)
    const [ rating, setRating ] = useState<any>(3) // Initial value

    // we only want to fetch the quiz once on mount
    // but similarly as before, wait for db and user to be defined
    // so use a flag
    const [ hasMounted, setHasMounted ] = useState<boolean>(false)
    useEffect(() => {
        if (db && user && dbUser && !hasMounted) {
            const fetch = async () => {
                await fetchQuizById(router.query.quiz_id)
                .then((doc: QuizData | undefined) => {
                    setQuiz(doc)
                    setError(null)
                    setHasMounted(true)
                })
                .catch((err: any) => {
                    setQuiz(undefined)
                    setError("An error occured retrieving this quiz.")
                })
            }
            fetch()
        }
    }, [db, user, dbUser, hasMounted])

    const hasRated = () => {
        return dbUser.scores.some((score: any) => score.id === router.query.quiz_id && score.rating !== 0) 
    }

    return (<>
    {/* <button onClick={() => fetchQuizById(router.query.quiz_id).then(doc => console.l)}>fetch</button> */}
    { !quiz ? <>An error occured. <p>{error}</p> </> : <main className={styles.QuizPage}>
        
        <motion.h1 initial={{ y: -200 }} animate={{ y: 0 }} id="title">{quiz.title}</motion.h1>
        <h3 id="subject">{quiz.subject}</h3>
        <h6 id="author">Author: <span>{quiz.author}</span></h6>
        <h6 id="challenger">Challenger: <span>{dbUser?.displayName}</span></h6>
        
        { console.log(quiz?.rating) }

        { /* TAKEN QUIZ BEFORE */
            dbUser.scores.some((score: any) => score.id === router.query.quiz_id) && <>
                <h6>You've taken this quiz before! </h6>
                <h6 id="history">You scored: {dbUser.scores.find((score: any) => score.id === router.query.quiz_id)?.score}</h6>

                <div>
                    <p>Help the author out by giving this quiz a rating! </p>
                    <Rating
                        style={{ maxWidth: 180, filter: hasRated() ? 'saturate(0.4)' : 'none' }}
                        value={ hasRated() ? quiz?.rating : rating }
                        readOnly={ hasRated() ? true : false }
                        onChange={setRating}
                    />
                    <button onClick={async () => {
                        if (!hasRated()){
                            await submitRating(rating, router.query.quiz_id)
                            .then((val) => {
                                setQuiz(val?.data())
                            }) //retrieve new version
                        }
                    }}>Submit rating</button>
                </div>

            </>
        }

        <p className={styles.Completed}>Score: {score?.count || 0}/{quiz.questions.length}</p>

        { !start ? <motion.button key={'button'} className={styles.Start} animate={{ scale: [1, 1.01, 1.03, 1.05, 1.03, 1.01, 1] }} exit={{opacity: 0 }} transition={{ scale: { repeatType: 'loop', repeat: Infinity } }} onClick={()=>setStart(true)}>Click to start</motion.button> : <>

            <Formik 
                initialValues={{ answers: [] }}
                validationSchema={ Yup.object({
                    answers: Yup.array()
                        .of( Yup.string().required("Answer required.") )
                        .required("Must answer questions.")
                        .length(quiz.questions.length, "")
                       
                }).required("Required") }
                onSubmit={async ({answers}: any)=>{
                    setScore(null)
                    const s = await submitAnswers(answers, router.query.quiz_id)
                    if(s) {
                        setScore(s)
                    }
                }}
            >
                {
                    props => <form onSubmit={(e) => {props.handleSubmit(e)}}>
                        { quiz.questions.map((question: any, key: any) => (

                            <div key={key} className={styles.QuestionContainer}>
                                <FieldArray 
                                    name="answers"
                                    render={ arrayHelpers => (<>
                                        <Question question={question} idx={key}>
                                            { (score) && <p>Answer: {score.answer_key[key]}</p> }
                                        </Question> 
                                    </>) }
                                />
                            </div>

                        )) }
                        { /* if we have the main level error */}
                        { typeof props.errors.answers === 'string' && <span id="feedback">{props.errors.answers}</span>}
                        { !score && <button type='submit'>Submit</button> }
                    </form>
                }
            </Formik>

        </> }

        { /* once done */}
        {/* { numCompleted?.length === quiz?.quiz?.questions.length && <>
            {  rating }
            <div>
                <p>Help the author out by giving this quiz a rating! </p>
                <Rating
                    style={{ maxWidth: 180, filter: rated ? 'saturate(0.5)' : 'none' }}
                    value={rated ? quiz?.rating : rating}
                    readOnly={rated ? true : false}
                    onChange={setRating}
                />
            </div>
        </> } */}

    </main>}
    </>)
}

QuizPage.getLayout = function getLayout(page: ReactElement) {
    return (
        <DashboardLayout>
            {page}
        </DashboardLayout>
    )
}

export default QuizPage