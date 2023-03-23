import { useContext } from "react"
import { FirebaseFirestoreContext } from "../context/FirebaseFirestoreProvider"

const useFirebaseFirestoreContext = () : any => {
    return useContext(FirebaseFirestoreContext)
}

export default useFirebaseFirestoreContext