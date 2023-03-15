import useFirebaseFirestoreContext from "./useFirebaseFirestoreContext"
import { getDoc, query, addDoc, collection, doc, orderBy, setDoc, Timestamp, onSnapshot, DocumentSnapshot, QuerySnapshot, limit } from "firebase/firestore"
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
                console.log(querySnapshot)
                const updatedQuizzes = querySnapshot.docs.map((docSnapshot: DocumentSnapshot) => {
                    return {
                        id: docSnapshot.id,
                        data: docSnapshot.data()
                    }
                })
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
    const streamQuizzes = async (n: number = 1, snapshot: any, error: any) => {
        const quizzes_colref = collection(db, "Quizzes")
        const latest_query = query(quizzes_colref, orderBy('timestamp', 'desc'), limit(n || 1))
        return onSnapshot(latest_query, snapshot, error)
    }

    const getLatest = (n: number = 1) => {
        setQuizNum(n)
    }

    // GET QUESTION
    const getQuiz = async (id: any) => {
        const question = await getDoc(doc(db, `/Quizzes/${id}`))
        return question
    }

    return { createQuiz, getLatest, quizzes, getQuiz }
}

export default useFirebaseFirestore