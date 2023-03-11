import DashboardLayout from "../../../layout/DashboardLayout/DashboardLayout"
import { ReactElement } from "react"

const yo = () => {
    return (
        <>yo</>
    )
}

yo.getLayout = function getLayout(page: ReactElement) {
    return (
        <DashboardLayout>
            {page}
        </DashboardLayout>
    )
}

export default yo
