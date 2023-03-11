import NotLoggedIn from "../../component/NotLoggedIn/NotLoggedIn"
import SidePanel from "../../component/SidePanel/SidePanel"
import useFirebaseUserContext from "../../hooks/useFirebaseUserContext"
import styles from './DashboardLayout.module.css'

export default function DashboardLayout ({children}: any) {
    const { user } = useFirebaseUserContext()
    if ( user === undefined || user === null )
        return (<NotLoggedIn />)
    return <main className={styles.DashboardLayout}>
        <SidePanel />
        {children}
    </main>
}