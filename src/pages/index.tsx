import Head from 'next/head'
import Image from 'next/image'
import { useEffect, useState } from 'react'

import SignUp from '../../component/SignUp/SignUp'

import useFirebaseAppContext from '../../hooks/useFirebaseAppContext'
import useFirebaseUserContext from '../../hooks/useFirebaseUserContext'
import useFirebaseFirestoreContext from '../../hooks/useFirebaseFirestoreContext'
import useFirebaseFirestore from '../../hooks/useFirebaseFirestore'
import Login from '../../component/Login/Login'

import { motion, MotionConfig, AnimatePresence } from 'framer-motion'
import DashboardPanel from '../../component/Home/DashboardPanel/DashboardPanel'

const marqueeVariants = {
  animate: {
    x: [200, -800],
    transition: {
      x: {
        repeat: Infinity,
        repeatType: "loop",
        duration: 15,
        ease: "linear",
      }
    },
  }
}

export default function Home() {

  const { user } = useFirebaseUserContext()
  const { app } = useFirebaseAppContext()
  const { createUser } = useFirebaseFirestore() 
  const { db } = useFirebaseFirestoreContext()
  const [ toggle, setToggle ] = useState(false)

  useEffect(() => {
    if(db && user)
      createUser(user)
}, [user, db])

  // useEffect(() => {
  //   console.log("App: ", app)
  // }, [app])

  return (
    <>
      <Head>
        <title>Quizcraft</title>
        <meta name="description" content="Intuitive planner." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="landing">
        <h1>Welcome to your newest proctor.</h1>
        <blockquote>
          <motion.div 
            variants={marqueeVariants} 
            animate="animate"         
          >
            <p><span>Take quizzes or create your own.</span> <span>Attach files, images and customize.</span> <span>Post and join the community.</span></p>
          </motion.div>
        </blockquote>
      </header>

      <motion.div layout className="mid">

        <DashboardPanel />

        <MotionConfig transition={{ duration: 5 }}>
        { user === null && <section>
          <AnimatePresence mode='wait'>
            { toggle ? <SignUp toggler={()=>setToggle(false)}/> : <Login toggler={()=>setToggle(true)} /> }
          </AnimatePresence>
        </section> }
        </MotionConfig>


      </motion.div>

    </>
  )
}

