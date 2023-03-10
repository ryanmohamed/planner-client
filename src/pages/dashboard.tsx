import useFirebaseUserContext from "../../hooks/useFirebaseUserContext";
import NotLoggedIn from "../../component/NotLoggedIn/NotLoggedIn";

export default function Dashboard () {
    const { user } = useFirebaseUserContext()
    if( user === null || user === undefined ) 
        return (<NotLoggedIn />)
        

    return (<>
        <p>Welcome to the dashboard</p>
    </>)
}