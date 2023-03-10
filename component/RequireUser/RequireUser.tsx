import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import useFirebaseUserContext from '../../hooks/useFirebaseUserContext'

const RequireUser = ({children}: any) => {
    const { user } = useFirebaseUserContext()
    const router = useRouter()

    useEffect(() => {
        if(user.currentUser === undefined || user.currentUser === null)
            router.push('/')
    }, [user])

    return (
        <>
            <p>Redirecting...</p>
            {children}
        </>
    );
}

export default RequireUser