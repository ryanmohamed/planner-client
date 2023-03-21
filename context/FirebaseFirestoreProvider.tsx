import { createContext, useEffect, useState } from "react"
import useFirebaseAppContext from "../hooks/useFirebaseAppContext"
import useFirebaseUserContext from "../hooks/useFirebaseUserContext"
import { getFirestore, Firestore, setDoc, doc, getDoc, Timestamp, onSnapshot } from "firebase/firestore"
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

    const val: any = { db, setDB, dbUser } // verify types later

    useEffect(() => {
        const database: any = getFirestore(app || undefined) // if the app isn't defined yet, pass undefined - we can get back either an Auth, null, or undefined
        setDB(database)
    }, [app])


     // the main realtime data we should have is the USER
    // for a lot of UX/UI components we need to check some details from the user
    // performing a read operation when data hasn't even changed is inefficient
    // when we're reading so often, listen to changes on the user
    
    const [unsubscribe, setUnsubscribe] = useState<any>(null)

    // REALTIME LISTENER FOR CHANGES TO USER DOCUMENT IN FIRESTORE
    // keep in mind, if our auth state changes, we need to unsubscribe and listen to another document
    const listenToUser = () => {
        if(db && user){
            const unsub = onSnapshot(doc(db, "Users", user.uid), (doc: any) => {
                if(doc.exists()){
                    console.log("Current db user: ", doc.data())
                    setDbUser(doc.data())
                }
            })
            setUnsubscribe(() => unsub)
        }
    }

    const unsubscribeFromUser = () => {
        if (unsubscribe) {
            unsubscribe()
        }
        setUnsubscribe(null)
    }

    // ideally we shouldn't be using onauthstatechanged in this file
    // we run the risk of the code here executing synchronously with the 
    // code setting our global user context
    // instead we need to wait for changes to the user context
    useEffect(() => {
        console.log("Global user is ", user)
        if (user){
            createUser(user)
            .then(() => listenToUser())
            .catch((err: any) => console.log("an error occured calling create user: ", user))
        }
        else {
            setDbUser(null)
            unsubscribeFromUser()
        }
    }, [user])

    // called once on app mount and on auth changes
    // possible write
    const createUser = async (user: UserType) => {
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

    return (
        <FirebaseFirestoreContext.Provider value={val}>
            { children }
        </FirebaseFirestoreContext.Provider>
    )
}

export { FirebaseFirestoreProvider, FirebaseFirestoreContext }