import { DocumentSnapshot } from 'firebase/firestore'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import useFirebaseFirestore from '../../../../../hooks/useFirebaseFirestore'

const QuizPage = () => {
    const router = useRouter()
    const [ quiz, setQuiz ] = useState<any>(null)
    const [ error, setError ] = useState<any>(null)
    const { getQuiz } = useFirebaseFirestore()

    useEffect(() => {
        getQuiz(router.query.quiz_id)
        .then((docSnapshot: DocumentSnapshot) => setQuiz(docSnapshot.data()))
        .catch((err: any) => setError(err))
    }, [])

    useEffect(() => {
        console.log()
    }, [quiz])

    return <>
        <h1>quiz page: {router.query.quiz_id}</h1>
        <p>{quiz && quiz.question.title}</p>
    </>
}
export default QuizPage