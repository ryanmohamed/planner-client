import { useContext } from "react"
import { FirebaseUserContext } from "../context/FirebaseUserProvider"

const useFirebaseUserContext = () : any => {
    return useContext(FirebaseUserContext)
}

export default useFirebaseUserContext