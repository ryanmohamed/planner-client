import { useEffect, useState } from "react"
import { QuizHeader } from "QuizHeaderType"
import { QuizData } from "QuizData"

// context
import useFirebaseAppContext from "./useFirebaseAppContext"
import useFirebaseUserContext from "./useFirebaseUserContext"
import useFirebaseFirestoreContext from "./useFirebaseFirestoreContext"

// fire store
import { where, query, addDoc, collection, doc, orderBy, Timestamp, limit, updateDoc, getDocs, startAfter, getDoc, increment, runTransaction } from "firebase/firestore"
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


    // 1 - recent
    // 2 - searchType
    const [ queryType, setQueryType ] = useState<any>(1)
    const [ subject, setSubject ] = useState<any>(null)

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

            setQueryType(1)
        }
    }

    const fetchNextRecentQuizzes = async (n: number) => {
        // if we have a last doc
        if (lastDocSnap) {
            const collection_ref = collection(db, "Quizzes")
            const q = queryType === 1 ? query(collection_ref, orderBy("timestamp", "desc"), limit(n), startAfter(lastDocSnap)) : query(collection(db, "Quizzes"), where('subject', '==', subject), limit(n), startAfter(lastDocSnap))
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

    const fetchQuizById = async (id: any): Promise<QuizData | undefined> => {
        if (db && user && dbUser) {
            const docSnapshot = await getDoc(doc(db, "Quizzes", id))
            if (docSnapshot.exists()){

                const payload = {
                    title: docSnapshot.data()?.title,
                    subject: docSnapshot.data()?.subject,
                    author: docSnapshot.data()?.author,
                    img_url: docSnapshot.data()?.img_url,
                    questions: docSnapshot.data()?.questions.map((question: any, key: any) => ({
                        question: docSnapshot.data()?.questions[key].question,
                        type: docSnapshot.data()?.questions[key].type,
                        choices: docSnapshot.data()?.questions[key].choices
                    })),
                    attempts: docSnapshot.data()?.attempts,
                    rating: docSnapshot.data()?.rating,
                    timestamp: docSnapshot.data()?.timestamp
                }

                return payload 
            }
        }
    }

    const queryQuizzesBySubject = async (subject: string) => {
        if (db && user && dbUser) {
            const querySnapshot = await getDocs(query(collection(db, "Quizzes"), where('subject', '==', subject), limit(5)))
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

            setSubject(subject)

            console.log("headers: ", headers)
            setQuizHeaders(headers)

            // use the last document as a starting point in pagination
            const last = querySnapshot.docs[querySnapshot.size - 1]
            setLastDocSnap(last)

            setQueryType(2)
        }
    }

    // recall we need to only submit answers
    // if the user hasn't taken the question before
    // luckily we have the dbUser state to check
    // this function requires 1 read and 1 write
    const submitAnswers = async (answers: any, quiz_id: any) => {
        // fetch the answers for each submission, because we still want to return 
        // our current score
        if(user && dbUser && db){
            let values = {
                count: 0,
                answer_key: []
            }
            await getDoc(doc(db, "Quizzes", quiz_id))
            .then((docSnapshot: any) => {
                if(docSnapshot.exists()){
                    values.answer_key = docSnapshot.data()?.questions.map((question: any) => question.answer)
                    // score is how many these arrays share
                    // don't do anything if the arrays dont share the same length
                    if(values.answer_key.length === answers.length){
                        for (let i = 0; i < answers.length; i++)
                        
                            if (values.answer_key[i] === answers[i])
                                values.count++

                        console.log("You scored: ", values.count)

                        // only perform the write operation if the dbUser hasn't yet taken this quiz
                        // now write the score to the users document
                        // if the array has no score for the same quiz_id
                        if (!dbUser.scores.some((score: any) => score.id === quiz_id)) {
                            console.log("Hasn't taken before.")
                            updateDoc(doc(db, "Users", user.uid), {
                                scores: [...dbUser?.scores, {
                                    id: quiz_id,
                                    score: values.count,
                                    rating: 0
                                }]
                            })
                            .then(() => console.log("Succesfully updated score to: ", values.count))
                            .catch((err: any) => console.log("An error occured writing score to profile: ", err))
                        }
                    }
                }
            })
            .catch((err: any) => console.log("Error occured submitting answers: ", err))
            return values
        }
    }

    // when we submit a rating, two things have to change
    // first, the quiz itself has to update it's average rating by incrementing it's attempts and then ca
    // second, the user has to update itself individual score
    // the reasoning is to save us a future read
    // this comes at the cost of 1 extra write but this type of component has one interaction per user
    const submitRating = async (rating: any, quiz_id: any) => {
        // user has never submitted a rating before for this quiz, cap this at one use for each quiz
        if(db && dbUser && user && !dbUser?.scores.some((score: any) => score.id === quiz_id && score.rating !== 0 )){
            // update the quiz's rating, to do that we need a previous value
            // so this operation will cost 1 read and 1 write
            // run a transaction since this operation may clash with other users
            await runTransaction(db, async (transaction) => {
                // 1 read
                const docSnapshot = await transaction.get(doc(db, "Quizzes", quiz_id))
                if (docSnapshot.exists()) {
                    const prevRating = docSnapshot.data()?.rating
                    const prevAttempts = docSnapshot.data()?.attempts // we can also use the increment function for this by why not if we're already reading
                
                    // 1 write - update quiz fields
                    // 1 write - update user fields
                    // already have user document to retrieve previous values
                    const newScores = dbUser?.scores.map((score: any) => ({
                        id: score.id,
                        score: score.score, 
                        rating: score.id === quiz_id ? rating : score.rating
                    }))

                    transaction.update(doc(db, "Quizzes", quiz_id), { // if statement handles empty document
                        attempts: prevAttempts+1,
                        rating: (prevRating+rating)/2
                    })
                    .update(doc(db, "Users", user.uid), {
                        scores: newScores
                    })

                    console.log("Finished transaction!")
                }
 
            })

            // perform once more read opeartion to return updated quiz
            const docSnapshot = await getDoc(doc(db, "Quizzes", quiz_id))
            return docSnapshot

        }
    }


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
    return { createQuiz, fetchRecentQuizzes, fetchNextRecentQuizzes, quizHeaders, fetchQuizById, submitAnswers, submitRating, queryQuizzesBySubject }
}

export default useFirebaseFirestore