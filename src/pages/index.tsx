import Head from 'next/head'
import Image from 'next/image'
import styles from '@/styles/Home.module.css'
import { useEffect } from 'react'

import SignUp from '../../component/SignUp/SignUp'
import Logout from '../../component/Logout/Logout'

import useFirebaseAppContext from '../../hooks/useFirebaseAppContext'
import useFirebaseUserContext from '../../hooks/useFirebaseUserContext'

export default function Home() {

  const { user } = useFirebaseUserContext()
  const { app } = useFirebaseAppContext()

  useEffect(() => {
    console.log("User: ", user)
  }, [user])

  useEffect(() => {
    console.log("App: ", app)
  }, [app])

  return (
    <>
      <Head>
        <title>Planner</title>
        <meta name="description" content="Intuitive planner." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1>Welcome.</h1>
      <p style={{marginBottom: '20px'}}><i>This is a planner.</i></p>
      
      { user === null ? <>
        not logged in
      </> : <> logged in </>}

      { user === null ? <SignUp /> : <Logout /> }

    </>
  )
}

