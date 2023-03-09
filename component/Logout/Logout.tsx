import useFirebaseUserContext from "../../hooks/useFirebaseUserContext"
import { signOut } from "firebase/auth"

export default function Logout () {
    const { user } = useFirebaseUserContext()
    return <>
        <button onClick={async () => {
            if (user !== undefined && user !== null) {
                signOut(user.auth)
            }
        }}>logout</button>
    </>
}