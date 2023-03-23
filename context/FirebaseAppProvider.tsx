import { FirebaseApp, initializeApp } from "firebase/app"
import { createContext, useEffect, useState } from "react"
import { appConfig } from "../lib/firebase"

import {  } from 'firebase/firestore'

type App = FirebaseApp | null
const firebaseApp: App = initializeApp(appConfig)
const FirebaseAppContext = createContext(undefined)

const FirebaseAppProvider = ({children}: any) => {
    const [ app, setApp ] = useState<FirebaseApp | null>(null)
    const val: any = { app } // verify type from value in provider later

    useEffect(() => {
        setApp(firebaseApp)
    }, [])

    return (
        <FirebaseAppContext.Provider value={val}>
            { children }
        </FirebaseAppContext.Provider>
    )
}

export { FirebaseAppProvider, FirebaseAppContext }