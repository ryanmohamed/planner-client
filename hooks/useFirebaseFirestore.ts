import { useEffect, useState } from "react"
import { QuizHeader } from "QuizHeaderType"

// context
import useFirebaseAppContext from "./useFirebaseAppContext"
import useFirebaseUserContext from "./useFirebaseUserContext"
import useFirebaseFirestoreContext from "./useFirebaseFirestoreContext"

// fire store
import { query, addDoc, collection, doc, orderBy, Timestamp, limit, updateDoc, getDocs, startAfter, getDoc } from "firebase/firestore"
import { DocumentData, DocumentSnapshot } from "@google-cloud/firestore"

// CRUD operations
const useFirebaseFirestore = () => {
    const { app } = useFirebaseAppContext()
    const { user } = useFirebaseUserContext()
    const { db, dbUser } = useFirebaseFirestoreContext()

    // PAGINATE
    // For a seamless infinite scroll we need an array to contain the data from all quizzes fetched so far
    // however we don't really want to store additional data besides header fields due to overhead of the storing all of that as
    // for example we don't need image data or anything about the questions, just the title and author
    // + additionally we will alter our NoSQL db (unnormalize) and include some reduncacies to decrease read amount
    //  particularly img_url, author in Quizzes, and the quizzes foreign key in Users
    const [ quizHeaders, setQuizHeaders ] = useState<QuizHeader[]>([])
    const [ lastDocSnap, setLastDocSnap ] = useState<any>(null)

    const createQuiz = async (values: any) => {
        if(db && user && dbUser){
            const { uid, photoURL, displayName } = user

            // remove confirmed boolean
            const cleaned: any[] = values.questions.map((val: any) => ({
                answer: val.answer,
                choices: val?.choices || { a: '', b: '', c: '', d: '' }, //undefined not allowed in firestore
                question: val.question,
                type: val.type,
            }))

            const payload = {
                title: values.title,
                subject: values.subject,
                author: displayName || 'Anonymous',
                questions: cleaned,
                attempts: 0, 
                rating: 0,
                timestamp: Timestamp.fromDate(new Date()),
                uid: uid,
                img_url: photoURL
            }
            // create quiz
            const docRef = await addDoc(collection(db, "Quizzes"), payload)
            .then(async (docRef) => {
                console.log("Created new quiz with id: ", docRef?.id)
                // update user
                await updateDoc(doc(db, "Users", user.uid), {
                    quizzes: [...dbUser?.quizzes, docRef?.id],
                    timestamp: Timestamp.fromDate(new Date())
                })
                .then(() => console.log("Updated user quizzes field!"))
                .catch((err: any) => console.log("Error updating user's quizzes: ", err))
            })
            .catch((err: any) => console.log("Error creating quiz", err))            
        }
    }

    // loading posts is a tricky ask
    // while we may want our "feed" to be as recent and realtime as possible
    // streaming this data through a listener in this case cannot scale
    // every user is listening to the entire Quizzes collection for updates and simply returns the top 1-50
    // thats a big cost for a such a small return
    // rather we should fetch this data ONLY when asked

    // like an assignment operation, replaces previous contents
    const fetchRecentQuizzes = async (n: number) => {
        if (db && user && dbUser) {
            // N reads
            const querySnapshot = await getDocs(query(collection(db, "Quizzes"), orderBy("timestamp", "desc"), limit(n))) // keep in mind this will first query the server and then the cache in certain scenarios
            let headers: QuizHeader[] = []
            querySnapshot.forEach((doc) => {
                // doc.data() never undefined for query doc snapshots
                console.log(doc.id, " => ", doc.data())
                headers.push({
                    title: doc.data()?.title,
                    subject: doc.data()?.subject,
                    author: doc.data()?.author,
                    img_url: doc.data()?.img_url,
                    num_questions: doc.data()?.questions.length,
                    rating: doc.data()?.rating,
                    id: doc?.id 
                })
            })

            console.log("headers: ", headers)
            setQuizHeaders(headers)

            // use the last document as a starting point in pagination
            const last = querySnapshot.docs[querySnapshot.size - 1]
            setLastDocSnap(last)
        }
    }

    const fetchNextRecentQuizzes = async (n: number) => {
        // if we have a last doc
        if (lastDocSnap) {
            const collection_ref = collection(db, "Quizzes")
            const q = query(collection_ref, orderBy("timestamp", "desc"), limit(n), startAfter(lastDocSnap))
            const querySnapshot = await getDocs(q)

            // if we find more quizzes, copy the previous state and update the current header data for the infinite scroll
            if (!querySnapshot.empty){
                const headerCopy: QuizHeader[] = [...quizHeaders] // copy previous state
                querySnapshot.forEach((doc) => {
                    console.log(doc.id, " => ", doc.data())
                    headerCopy.push({
                        title: doc.data()?.title,
                        subject: doc.data()?.subject,
                        author: doc.data()?.author,
                        img_url: doc.data()?.img_url,
                        num_questions: doc.data()?.questions.length,
                        rating: doc.data()?.rating,
                        id: doc?.id 
                    })
                })
                console.log("header: ", headerCopy)
                setQuizHeaders(headerCopy)
                // use the last document as a starting point in pagination
                const last = querySnapshot.docs[querySnapshot.size - 1]
                setLastDocSnap(last)
            }
        }
    }

    const fetchQuizById = async (id: any): Promise<DocumentData | undefined> => {
        if (db && user && dbUser) {
            const docSnapshot = await getDoc(doc(db, "Quizzes", id))
            if (docSnapshot.exists()){
                console.log("it exists")
                return docSnapshot.data() // do not return with the answer ** REVISE **
            }
        }
    }

    // useEffect((): any => {
    //     const unsubscribe = streamQuizzes(quizNum, 
    //         (querySnapshot: QuerySnapshot) => {
    //             const updatedQuizzes = querySnapshot.docs.map((docSnapshot: DocumentSnapshot) => {
    //                 return {
    //                     id: docSnapshot.id,
    //                     data: {
    //                         title: docSnapshot.data()?.question.title,
    //                         subject: docSnapshot.data()?.question.subject,
    //                         numQuestions: docSnapshot.data()?.question.questions.length,
    //                         rating: docSnapshot.data()?.rating,
    //                         attempts: docSnapshot.data()?.attempts,
    //                         uid: docSnapshot.data()?.uid
    //                     }
    //                 }
    //             })
    //             setQuizzes(updatedQuizzes)
    //         },
    //         (error: any) => setErr(error)
    //     )
    //     return () => {
    //         unsubscribe
    //     }
    // }, [quizNum])

    // // READ
    // const streamQuizzes = async (n: number = 5, snapshot: any, error: any) => {
    //     if(db){
    //         const quizzes_colref = collection(db, "Quizzes")
    //         const latest_query = query(quizzes_colref, orderBy('timestamp', 'desc'), limit(n || 1))
    //         return onSnapshot(latest_query, snapshot, error)
    //     }
    // }
    // const getLatest = (n: number = 5) => {
    //     setQuizNum(n)
    // }

    // const getQuiz = async (id: any) => {
    //     if(db){
    //         return getDoc(doc(db, `/Quizzes/${id}`))
    //         .then((docSnapshot: DocumentSnapshot) => ({
    //             quiz: {
    //                 questions: docSnapshot.data()?.question?.questions?.map((q: any, key: any) => ({
    //                     question: q.question,
    //                     type: q.type,
    //                     choices: q.choices
    //                 })),
    //             },
    //             rating: docSnapshot.data()?.rating,
    //             attempts: docSnapshot.data()?.attempts,
    //             title: docSnapshot.data()?.question?.title,
    //             subject: docSnapshot.data()?.question?.subject,
    //             uid: docSnapshot.data()?.uid
    //         }))
    //         .catch((err: any) => err)
    //     }
    // }

    // const getScores = async () => {
    //     if(db && user){
    //         return getDoc(doc(db, `/Users/${user.uid}`))
    //         .then((docSnapshot: DocumentSnapshot) => docSnapshot.data()?.score )
    //         .catch((err: any) => err)
    //     }
    // }

    // const getUser = async (uid: any) => {
    //     return getDoc(doc(db, `/Users/${uid}`))
    //     .then((docSnapshot: DocumentSnapshot) => docSnapshot.data())
    //     .catch((err: any) => err)
    // }

    // const checkAnswer = async (id: any, idx: any, answer: any) => {
    //     if(db && user){
    //         return getDoc(doc(db, `/Quizzes/${id}`))
    //         .then(async (docSnapshot: DocumentSnapshot) => answer === docSnapshot.data()?.question?.questions[idx].answer)
    //         .catch((err: any) => err)
    //     }
    // }

    

    // // UPDATE
    // const updateScore = async (id: any, score: any) => {
    //     if(user && db){
    //         const doc_ref = doc(db, `/Users/${user.uid}`)
    //         const scores = await getScores().then(val => val)
    //         scores.push({
    //             quiz_id: id,
    //             score: score,
    //             rated: false
    //         })
    //         await updateDoc(doc_ref, 'score', scores)
    //         .then(() => console.log("Update succesfully to ", score))
    //     }
    // }

    // const updatePlayerRating = async (id: any) => {
    //     if(user && db){
    //         const doc_ref = doc(db, `/Users/${user.uid}`)
    //         const scores = await getScores().then(val => val)
    //         const new_scores = scores.map((score: any) => ({
    //             quiz_id: score.quiz_id,
    //             rated: score.quiz_id === id ? true : score.rated,
    //             score: score.score
    //         }))
    //         await updateDoc(doc_ref, 'score', new_scores)
    //         .then(() => console.log("Update succesfully to ", new_scores))
    //     }
    // }

    // const updateQuizRating = async (id: any, rating: any) => {
    //     if(db){
    //         const doc_ref = doc(db, `/Quizzes/${id}`)
    //         const quiz = await getDoc(doc_ref)
    //         .then(async (docSnapshot: DocumentSnapshot) => {
    //             const score = docSnapshot.data()
    //             const new_rating = (score?.rating + rating) / 2
    //             const new_attempts = score?.attempts + 1
    //             await updateDoc(doc_ref, 'rating', new_rating, 'attempts', new_attempts)
    //             .then(() => console.log("Update succesfully to ", new_rating, new_attempts))
    //             .catch((err: any) => console.log("Error: ", err))
    //         })
    //         .catch((err: any) => console.log("Error: ", err))
    //         console.log(quiz)
    //     }
    // }

    
    // createQuiz, getLatest, quizzes, getQuiz, checkAnswer, createUser, createScore, updateScore, getScores, updatePlayerRating, updateQuizRating, getUser
    return { createQuiz, fetchRecentQuizzes, fetchNextRecentQuizzes, quizHeaders, fetchQuizById }
}

export default useFirebaseFirestore