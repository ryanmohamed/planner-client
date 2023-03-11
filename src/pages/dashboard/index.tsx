import useFirebaseUserContext from "../../../hooks/useFirebaseUserContext";
import DashboardLayout from "../../../layout/DashboardLayout/DashboardLayout";

import { ReactElement } from "react";
import type { NextPageWithLayout } from '../_app'

import styles from './Dashboard.module.css'

const Dashboard: NextPageWithLayout = () => {
    const { user } = useFirebaseUserContext()
    return (<main className={styles.Dashboard}>
        <div>
            <h1 className="heading">Welcome {!user.isAnonymous && 'back'} {user?.displayName?.split(' ')[0] || user?.email || 'Anonymous' } 😁</h1>
            <p className="subheading"> Check out how your latests posts have been doing below</p>
        </div>
    </main>)
}

Dashboard.getLayout = function getLayout(page: ReactElement) {
    return (
        <DashboardLayout>
            {page}
        </DashboardLayout>
    )
}

export default Dashboard
