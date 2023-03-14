import { createContext, useEffect, useState } from "react"
import useFirebaseAppContext from "../hooks/useFirebaseAppContext"
import { getFirestore, Firestore } from "firebase/firestore"

type DBType = Firestore | null
type ContextState = { 
    db: Firestore 
}

const FirebaseFirestoreContext = createContext<ContextState | undefined>(undefined)

const FirebaseFirestoreProvider = ({children}: any) => {
    const { app } = useFirebaseAppContext()

    const [ db, setDB ] = useState<DBType>(null)
    const val: any = { db, setDB } // verify types later

    useEffect(() => {
        const database: any = getFirestore(app || undefined) // if the app isn't defined yet, pass undefined - we can get back either an Auth, null, or undefined
        setDB(database)
    }, [app])

    return (
        <FirebaseFirestoreContext.Provider value={val}>
            { children }
        </FirebaseFirestoreContext.Provider>
    )
}

export { FirebaseFirestoreProvider, FirebaseFirestoreContext }