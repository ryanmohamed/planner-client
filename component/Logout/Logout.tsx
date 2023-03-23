import useFirebaseUserContext from "../../hooks/useFirebaseUserContext"
import { signOut } from "firebase/auth"
import useFirebaseFirestoreContext from "../../hooks/useFirebaseFirestoreContext"

export default function Logout () {
    const { user } = useFirebaseUserContext()
    const { unsubscribe, setUnsubscribe } = useFirebaseFirestoreContext()
    return <>
        <button onClick={async () => {
            if (user !== undefined && user !== null) {
                signOut(user.auth)
                unsubscribe()
                setUnsubscribe(null)
                console.log("Unsubscribed from listening to db changes for the previous user.")
            }
        }}>logout</button>
    </>
}