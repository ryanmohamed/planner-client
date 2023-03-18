import { useEffect, useState } from "react"
import { onAuthStateChanged, getAuth } from "firebase/auth"
import useFirebaseFirestoreContext from "./useFirebaseFirestoreContext"
import useFirebaseUserContext from "./useFirebaseUserContext"
import { UserType } from '../context/FirebaseUserProvider'
import { where, getDoc, query, addDoc, collection, doc, orderBy, setDoc, Timestamp, onSnapshot, DocumentSnapshot, QuerySnapshot, limit, updateDoc } from "firebase/firestore"
import useFirebaseAppContext from "./useFirebaseAppContext"

interface ScoreData {
    quiz_id: string, 
    rated: number, 
    score: number
}

interface DbUser {
    displayName: string,
    img_url: string,
    xp: number,
    scores: ScoreData[],
    timestamp: Timestamp
} 

type DbUserType = DbUser | null

// CRUD operations
const useFirebaseFirestore = () => {
    const { app } = useFirebaseAppContext()
    const { user } = useFirebaseUserContext()
    const { db } = useFirebaseFirestoreContext()
    const [ dbUser, setDbUser ] = useState<DbUserType>(null)

    // the main realtime data we should have is the USER
    // for a lot of UX/UI components we need to check some details from the user
    // performing a read operation when data hasn't even changed is inefficient
    // when we're reading so often, listen to changes on the user

    // we need to WRITE a user first
    // const createUser = async (user: UserType) => {
    //     // the user must atleast exist
    //     if (user && db) {
    //         // query the database for a matching this users uid, this will most likely count as 1 read since 1 document at max will be returned
    //         const docRef = doc(db, "Users", `${user?.uid}`)
    //         const docSnap = await getDoc(docRef)
    //         if(docSnap.exists()){
    //             console.log("Found data: ", docSnap.data())
    //         }
    //         else console.log("No such user found")
        

    //         // const payload: DbUserType = {
    //         //     displayName: user?.displayName || 'Anonymous',
    //         //     img_url: user?.photoURL || 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/2048px-Default_pfp.svg.png',
    //         //     xp: 0,
    //         //     scores: [], // no score when we created it
    //         //     timestamp: Timestamp.fromDate(new Date())
    //         // }
    //     }
    //         // const quizzes_colref = collection(db, "Quizzes")
            
    //         // await addDoc(quizzes_colref, payload)
    //         // .then( val => console.log(val) )
    //         // .catch( err => console.log("error", err))
    // }

    // const createUser = async (user: any) => {
    //     if (!user || !db) return
    //     const doc_path = `/Users/${user.uid}`
    //     const payload = {
    //         displayName: user?.displayName || 'Anonymous',
    //         img_url: user?.photoURL || 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/2048px-Default_pfp.svg.png',
    //         score: [],
    //         xp: 0
    //     }


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

    // CREATE 
    // const createQuiz = async (values: any, user: any) => {
    //     if(db){
    //         const { uid } = user
    //         const cleaned: any[] = values.questions.map((val: any) => ({
    //             answer: val.answer,
    //             choices: val?.choices || { a: '', b: '', c: '', d: '' }, //undefined not allowed in firestore
    //             question: val.question,
    //             type: val.type,
    //         }))

    //         const payload = {
    //             attempts: 0, 
    //             question: {
    //                 title: values.title,
    //                 subject: values.subject,
    //                 questions: cleaned,
    //             },
    //             rating: 0,
    //             timestamp: Timestamp.fromDate(new Date()),
    //             uid: uid
    //         }
    //         const quizzes_colref = collection(db, "Quizzes")
            
    //         await addDoc(quizzes_colref, payload)
    //         .then( val => console.log(val) )
    //         .catch( err => console.log("error", err))
    //     }
    // }

    // const createUser = async (user: any) => {
    //     if (!user || !db) return
    //     const doc_path = `/Users/${user.uid}`
    //     const payload = {
    //         displayName: user?.displayName || 'Anonymous',
    //         img_url: user?.photoURL || 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/2048px-Default_pfp.svg.png',
    //         score: [],
    //         xp: 0
    //     }

    //     // check first 
    //     let user_doc = await getDoc(doc(db, doc_path))
    //     .then((docSnapshot: DocumentSnapshot) => docSnapshot.data())
    //     .catch((err: any) => err)
    //     .then(res => res)

    //     //this will rewrite the document, check if one exists first
    //     if(!user_doc){
    //         await setDoc(doc(db, doc_path), payload)
    //         .then(() => console.log("User created..."))
    //         .catch(err => console.log("Error: ...", err))
    //     } 
    //     else console.log("User already exists")
    // }


    // const createScore = async (id: any, score: any) => {
    //     if(user && db){
    //         const doc_ref = doc(db, `/Users/${user.uid}`)
    //         const scores = await getScores().then(val => val)
            
    //         if(scores.some((ele: any) => ele?.quiz_id === id)){
    //             return
    //         }
    //         scores.push({
    //             quiz_id: id,
    //             score: score, // before taking quiz
    //             rated: false
    //         })

    //         await updateDoc(doc_ref, 'score', scores)
    //         .then(() => console.log("Update succesfully to ", scores))
    //         .catch(err => console.log(err))
    //     }
    // }


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
    return { }
}

export default useFirebaseFirestore