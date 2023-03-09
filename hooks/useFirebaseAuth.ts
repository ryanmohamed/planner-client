import useFirebaseAppContext from "./useFirebaseAppContext"
import useFirebaseUserContext from "./useFirebaseUserContext"
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth"
import { authInfo } from "../component/SignUp/SignUp"

const useFirebaseAuth = () => {
    const { app } = useFirebaseAppContext()
    const { setUser } = useFirebaseUserContext()
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

    return { auth, SignUpWithEmailAndPassword }
}

export default useFirebaseAuth