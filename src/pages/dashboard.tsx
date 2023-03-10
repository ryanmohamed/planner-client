import useFirebaseUserContext from "../../hooks/useFirebaseUserContext";

export default function Dashboard () {
    const { user } = useFirebaseUserContext()
    if( user === null || user === undefined ) 
        return (<p>You must be signed in</p>)

    return (<>
        <p>Welcome to the dashboard</p>
    </>)
}