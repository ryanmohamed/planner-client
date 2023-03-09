import { createContext, FC, useEffect, useState } from "react"
import useFirebaseAppContext from "../hooks/useFirebaseAppContext"
import { User, getAuth, onAuthStateChanged } from "firebase/auth"

type UserType = User | null
type ContextState = { 
    user: User 
}
const FirebaseUserContext = createContext<ContextState | undefined>(undefined)

const FirebaseUserProvider = ({children}: any) => {
    const { app } = useFirebaseAppContext()

    const [ user, setUser ] = useState<UserType>(null)
    const val: any = { user, setUser } // verify types later

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(getAuth(app || undefined), setUser) 
        return unsubscribe;
    }, [])

    useEffect(() => {
        const appAuth: any = getAuth(app || undefined) // if the app isn't defined yet, pass undefined - we can get back either an Auth, null, or undefined
        setUser(appAuth?.currentUser)
    }, [app])

    return (
        <FirebaseUserContext.Provider value={val}>
            { children }
        </FirebaseUserContext.Provider>
    )
}

export { FirebaseUserProvider, FirebaseUserContext }