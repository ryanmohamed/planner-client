// import { useEffect, useState, ReactElement} from 'react'
// import { useRouter } from 'next/router'
// import { DocumentSnapshot } from 'firebase/firestore'

// import useFirebaseFirestore from '../../../../../hooks/useFirebaseFirestore'
// import useFirebaseUserContext from '../../../../../hooks/useFirebaseUserContext'

// import DashboardLayout from '../../../../../layout/DashboardLayout/DashboardLayout'
// import Question from '../../../../../component/Question/Question'

// import { Rating } from '@smastrom/react-rating'

// import styles from './QuizPage.module.css'

// import { AnimatePresence, motion } from 'framer-motion'

// const QuizPage = () => {
//     const router = useRouter()
//     const { user } = useFirebaseUserContext()
//     const { getQuiz, createScore, updatePlayerRating, updateQuizRating, getScores, getUser } = useFirebaseFirestore()

//     // state
//     const [ quiz, setQuiz ] = useState<any>(null)
//     const [ error, setError ] = useState<any>(null)
//     const [ start, setStart ] = useState<boolean>(false)
//     const [ numCompleted, setNumCompleted ] = useState<boolean[]>([])
//     const [ rating, setRating ] = useState<any>(3) // Initial value
//     const [ rated, setRated ] = useState<boolean>(false)
//     const [ author, setAuthor ] = useState<any>(null)

//     useEffect(() => {
//         getQuiz(router.query.quiz_id)
//         .then(q => {
//             setQuiz(q)
//             getUser(q.uid).then(ele => setAuthor({
//                 displayName: ele?.displayName || 'Anonymous',
//                 img_url: ele?.img_url || 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/2048px-Default_pfp.svg.png',
//                 xp: ele?.xp
//             }))
//         })
//     }, [])

//     useEffect(() => {
//         getQuiz(router.query.quiz_id)
//         .then(q => setQuiz(q))
//     }, [quiz])

//     useEffect(() => {
//         getRating()
//     }, [rated])

//     const getRating = async () => {
//         const s = await getScores().then(scores => scores)
//         console.log("scores: ", s)
//         const stats = s?.filter((score: any) => score.quiz_id === router.query.quiz_id)[0]
//         if(stats?.rated){
//             setRated(stats?.rated)
//         }
//     }

//     const onRate = async () => {
//         const s = await getScores().then(scores => scores)
//         const stats = s?.filter((score: any) => score.quiz_id === router.query.quiz_id)[0]
//         // if they took the quiz and haven't rated it yet
//         if(stats && !stats.rated){
//             updateQuizRating(router.query.quiz_id, rating)
//             updatePlayerRating(router.query.quiz_id)
//             setRated(true)
//             setError(null)
//         }
//         else if(!stats) setError("Must take quiz before rating.")
//     }

//     useEffect(() => {
//         if(quiz && numCompleted?.length === quiz?.quiz?.questions?.length){
//             const score = numCompleted.filter((n: any) => n === true).length
//             createScore(router.query.quiz_id, score)
//         }
//     }, [quiz, numCompleted])

//     return (<>
//     { !quiz ? <>An error occured. <p>{error}</p> </> : <main className={styles.QuizPage}>
        
//         <motion.h1 initial={{ y: -200 }} animate={{ y: 0 }} id="title">{quiz.title}</motion.h1>
//         <h3 id="subject">{quiz.subject}</h3>
//         { author && <h6 id="author">Author: <span>{author?.displayName}</span></h6> }
//         { author && <h6 id="challenger">Challenger: <span>{user?.displayName || user?.email || 'Anonymous'}</span></h6> }

        
//         <p className={styles.Completed}>Completed: {numCompleted?.length || 0}/{quiz?.quiz?.questions?.length}</p>

//         {/* start button or questions */}
//         <AnimatePresence mode="wait"> 
//         { !start ? <motion.button key={'button'} className={styles.Start} animate={{ scale: [1, 1.01, 1.03, 1.05, 1.03, 1.01, 1] }} exit={{opacity: 0 }} transition={{ scale: { repeatType: 'loop', repeat: Infinity } }} onClick={()=>setStart(true)}>Click to start</motion.button> : <>

//             { numCompleted?.length !== quiz?.quiz?.questions.length && quiz?.quiz?.questions.map((q:any, key:any) => (
//                 <Question key={key} idx={key} question={q} id={router.query.quiz_id} update={{ numCompleted, setNumCompleted }}/>
//             )) }

//         </> }
//         </AnimatePresence>

//         { /* once done */}
//         { numCompleted?.length === quiz?.quiz?.questions.length && <>
//             { /* rating */}
//             <div>
//                 <p>Help the author out by giving this quiz a rating! </p>
//                 <Rating
//                     style={{ maxWidth: 180, filter: rated ? 'saturate(0.5)' : 'none' }}
//                     value={rated ? quiz?.rating : rating}
//                     readOnly={rated ? true : false}
//                     onChange={setRating}
//                 />
//                 <button onClick={()=>{!rated ? onRate() : setError("You've rated this quiz already.")}}>Submit rating</button>
//                 { error && <span>{error}</span>}
//             </div>
//         </> }
        

        

//     </main>}
//     </>)
// }

// QuizPage.getLayout = function getLayout(page: ReactElement) {
//     return (
//         <DashboardLayout>
//             {page}
//         </DashboardLayout>
//     )
// }

// export default QuizPage