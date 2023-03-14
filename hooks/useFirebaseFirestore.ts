import useFirebaseFirestoreContext from "./useFirebaseFirestoreContext"
import { query, addDoc, collection, doc, orderBy, setDoc, Timestamp, onSnapshot, DocumentSnapshot, QuerySnapshot } from "firebase/firestore"
import { useEffect, useState } from "react"

// CRUD operations
const useFirebaseFirestore = () => {
    const { db } = useFirebaseFirestoreContext()
    const [ quizNum, setQuizNum] = useState<any>(null)
    const [ quizzes, setQuizzes ] = useState<any>(null)
    const [ err, setErr ] = useState<any>(null)

    useEffect((): any => {
        const unsubscribe = streamQuizzes(quizNum, 
            (querySnapshot: QuerySnapshot) => {
                const updatedQuizzes = querySnapshot.docs.map((docSnapshot: DocumentSnapshot) => docSnapshot.data())
                console.log(updatedQuizzes)
                setQuizzes(updatedQuizzes)
            },
            (error: any) => setErr(error)
        )
        return () => {
            unsubscribe
        }
    }, [quizNum])

    // CREATE 
    const createQuiz = async (values: any, user: any) => {
        const { uid } = user
        const payload = {
            uid: uid,
            question: {
                title: values.title,
                subject: values.subject,
                questions: values.questions.map((val: any) => { //remove confirmed boolean
                    return {
                        question: val.question,
                        type: val.type,
                        answer: val.answer,
                        choices: val.choices
                    }
                }),
            },
            timestamp: Timestamp.fromDate(new Date())
        }
        console.log(payload)
        const quizzes_colref = collection(db, "Quizzes")
        await addDoc(quizzes_colref, payload)
        .then( val => console.log(val) )
        .catch( err => console.log("error", err))
    }

    // READ
    const streamQuizzes = async (n: Number, snapshot: any, error: any) => {
        const quizzes_colref = collection(db, "Quizzes")
        const latest_query = query(quizzes_colref, orderBy('timestamp', 'desc'))
        return onSnapshot(latest_query, snapshot, error)
    }

    const getLatest = (n: Number) => {
        setQuizNum(n)
    }

    return { createQuiz, getLatest, quizzes }
}

export default useFirebaseFirestore