import useFirebaseAppContext from "./useFirebaseAppContext"
import useFirebaseUserContext from "./useFirebaseUserContext"
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithRedirect, signInWithPopup, GoogleAuthProvider, signInAnonymously, signOut } from "firebase/auth"
import { authInfo } from "../component/SignUp/SignUp"
import { useEffect } from "react"
const GoogleProvider = new GoogleAuthProvider()
GoogleProvider.addScope('email')

// const AppleProvider = new signInAnonymously

const useFirebaseAuth = () => {
    const { app } = useFirebaseAppContext()
    const { user, setUser } = useFirebaseUserContext()
    const auth = getAuth(app || undefined)


    const SignUpWithEmailAndPassword = async ({email, password} : authInfo, errorHandler: CallableFunction) => {
        if ( auth !== null && auth !== undefined ) {
            await createUserWithEmailAndPassword(auth, email, password)
            .then( userCredentials => {
                const newUser = userCredentials.user
                setUser(newUser)
                errorHandler(null)
            })
            .catch( err => {
                console.log(err)
                let errCode = err.code.substring(5, err.code.length).replace(/-+/g, ' ')
                errCode = errCode.charAt(0).toUpperCase() + errCode.slice(1) + '.'
                errorHandler(errCode)
            })
        }
    }

    const LoginWithEmailAndPassword = async ({email, password} : authInfo, errorHandler: CallableFunction) => {
        if ( auth !== null && auth !== undefined ) {
            await signInWithEmailAndPassword(auth, email, password)
            .then( userCredentials => {
                const newUser = userCredentials.user
                setUser(newUser)
                errorHandler(null)
            })
            .catch( err => {
                console.log(err)
                let errCode = err.code.substring(5, err.code.length).replace(/-+/g, ' ')
                errCode = errCode.charAt(0).toUpperCase() + errCode.slice(1) + '.'
                errorHandler(errCode)
            })
        }
    }

    const LoginWithGoogle = async (errorHandler: CallableFunction) => {
        if ( auth !== null && auth !== undefined ) {
            await signInWithPopup(auth, GoogleProvider)
            .then( userCredentials => {
                const newUser = userCredentials.user
                setUser(newUser)
                errorHandler(null)
            })
            .catch( err => {
                console.log(err)
                let errCode = err.code.substring(5, err.code.length).replace(/-+/g, ' ')
                errCode = errCode.charAt(0).toUpperCase() + errCode.slice(1) + '.'
                errorHandler(errCode)
            })
        }
    }

    const LoginWithApple = async (errorHandler: CallableFunction) => {
        if ( auth !== null && auth !== undefined ) {
            await signInWithPopup(auth, GoogleProvider)
            .then( userCredentials => {
                const newUser = userCredentials.user
                setUser(newUser)
                errorHandler(null)
            })
            .catch( err => {
                console.log(err)
                let errCode = err.code.substring(5, err.code.length).replace(/-+/g, ' ')
                errCode = errCode.charAt(0).toUpperCase() + errCode.slice(1) + '.'
                errorHandler(errCode)
            })
        }
    }

    const LoginAnonymously = async (errorHandler: CallableFunction) => {
        await signInAnonymously(auth)
        .then( userCredentials => {
            const newUser = userCredentials.user
            setUser(newUser)
            errorHandler(null)
        })
        .catch( err => {
            console.log(err)
            let errCode = err.code.substring(5, err.code.length).replace(/-+/g, ' ')
            errCode = errCode.charAt(0).toUpperCase() + errCode.slice(1) + '.'
            errorHandler(errCode)
        })
    }

    const SignOut = async () => {
        await signOut(auth)
    }

    return { auth, SignUpWithEmailAndPassword, LoginWithEmailAndPassword, LoginWithGoogle, LoginAnonymously, SignOut }
}

export default useFirebaseAuth