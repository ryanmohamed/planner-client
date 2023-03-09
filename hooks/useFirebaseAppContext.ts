import { useContext } from "react"
import { FirebaseAppContext } from "../context/FirebaseAppProvider"

const useFirebaseAppContext = () : any => {
    return useContext(FirebaseAppContext)
}

export default useFirebaseAppContext