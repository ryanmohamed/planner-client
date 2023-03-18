import { createContext, useEffect, useState } from "react"
import useFirebaseAppContext from "../hooks/useFirebaseAppContext"
import { getFirestore, Firestore, setDoc } from "firebase/firestore"
import useFirebaseUserContext from "../hooks/useFirebaseUserContext"
import { onAuthStateChanged, getAuth } from 'firebase/auth'
import { doc, getDoc, Timestamp, onSnapshot } from 'firebase/firestore'
import { UserType } from "./FirebaseUserProvider"

type DBType = Firestore | null
type ContextState = { 
    db: Firestore 
}

type ScoreData = {
    quiz_id: string, 
    rated: number, 
    score: number
}

type DbUser = {
    displayName: string,
    img_url: string,
    xp: number,
    scores: ScoreData[],
    quizzes: string[],
    timestamp: Timestamp
} 

type DbUserType = DbUser | null

const FirebaseFirestoreContext = createContext<ContextState | undefined>(undefined)

const FirebaseFirestoreProvider = ({children}: any) => {
    const { app } = useFirebaseAppContext()
    const { user } = useFirebaseUserContext()

    const [ db, setDB ] = useState<any>(null)
    const [ dbUser, setDbUser ] = useState<any>(null)
    const [ listener, setListener ] = useState<any>(false)
    const [ snapShotListener, setSnapShotListener ] = useState<any>(false)
    const val: any = { db, setDB, dbUser } // verify types later

    useEffect(() => {
        const database: any = getFirestore(app || undefined) // if the app isn't defined yet, pass undefined - we can get back either an Auth, null, or undefined
        setDB(database)
    }, [app])

     // the main realtime data we should have is the USER
    // for a lot of UX/UI components we need to check some details from the user
    // performing a read operation when data hasn't even changed is inefficient
    // when we're reading so often, listen to changes on the user
    
    // add the listener ONCE when the app mounts, and only add it once db and user are defined, hence dependencies and flag
    useEffect(() => {
        if(!listener){
            if(db && user){
                setListener(true)
                const unsubscribe = onAuthStateChanged(getAuth(app || undefined), createUser) 
                return unsubscribe;
            }
        }
    }, [db, user])

    // called once on app mount and on auth changes
    // possible write
    const createUser = async (user: UserType) => {
        console.log("creating user...")
        if(!db) console.log("no database")
        if(!user) console.log("no user")
        if(db && user){
            const docRef = doc(db, "Users", `${user?.uid}`)
            const docSnap = await getDoc(docRef)

            // user doesn't exist
            if(!docSnap.exists()){
                console.log("No such user found")
                //create
                const payload: DbUserType = {
                    displayName: user?.displayName || 'Anonymous',
                    img_url: user?.photoURL || 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/2048px-Default_pfp.svg.png',
                    xp: 0,
                    scores: [], // no score when we created it
                    quizzes: [],
                    timestamp: Timestamp.fromDate(new Date())
                }
                await setDoc(doc(db, 'Users', user.uid), payload)
                .then(() => { console.log("User created successfully")})
                .catch((err: any) => console.log("Error creating user: ", err))
            }

            else console.log("User already exists: ", docSnap.data())
        }
    }

    // REALTIME LISTENER FOR CHANGES TO USER DOCUMENT IN FIRESTORE
    useEffect(() => {
        // firestore, user, and listener must be defined before we can establish onSnapshot
        if(!snapShotListener){
            if(db && user){
                const unsubscribe = onSnapshot(doc(db, "Users", user.uid), (doc: any) => {
                    if(doc.exists()){
                        console.log("Current db user: ", doc.data())
                        setDbUser(doc.data())
                        setSnapShotListener(true)
                    }
                })
                return () => {
                    unsubscribe
                }
            }
        }
    }, [db, user])

    return (
        <FirebaseFirestoreContext.Provider value={val}>
            { children }
        </FirebaseFirestoreContext.Provider>
    )
}

export { FirebaseFirestoreProvider, FirebaseFirestoreContext }