import Head from 'next/head'
import Image from 'next/image'
import styles from '@/styles/Home.module.css'
import { useEffect, useState } from 'react'

import SignUp from '../../component/SignUp/SignUp'
import Logout from '../../component/Logout/Logout'

import useFirebaseAppContext from '../../hooks/useFirebaseAppContext'
import useFirebaseUserContext from '../../hooks/useFirebaseUserContext'
import Login from '../../component/Login/Login'

import { motion, MotionConfig, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

const marqueeVariants = {
  animate: {
    x: [200, -600],
    transition: {
      x: {
        repeat: Infinity,
        repeatType: "loop",
        duration: 10,
        ease: "linear",
      }
    },
  }
}

export default function Home() {

  const { user } = useFirebaseUserContext()
  const { app } = useFirebaseAppContext()
  const [ toggle, setToggle ] = useState(false)

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

      <header className="landing">
        <h1>Welcome to your newest planner.</h1>
        <blockquote>
          <motion.div 
            variants={marqueeVariants} 
            animate="animate"         
          >
            <p><span>Track tasks on a timely basis.</span> <span>Upload files for organization.</span> <span>Take control.</span></p>
          </motion.div>
        </blockquote>
      </header>

      <motion.div layout className="mid">

        <section>
          <Link href="/dashboard">Click me</Link>
        </section>

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

