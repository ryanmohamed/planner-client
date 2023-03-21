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

import item from '../../public/pngs/3d.png'
import arrow from '../../public/svgs/pppointed.svg'
import Link from 'next/link'

import { useMediaQuery} from 'react-responsive'

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
  const { db } = useFirebaseFirestoreContext()
  const [ toggle, setToggle ] = useState(false)
  const isMobile = useMediaQuery({ query: '(max-width: 800px)' })


  return (
    <>
      <Head>
        <title>Quizcraft</title>
        <meta name="description" content="Intuitive planner." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="landing">
        <div className='action'>
          <h1>Welcome to your newest proctor.</h1>
          <p><span>Take quizzes or create your own.</span> <span>Attach files, images and customize.</span> <span>Post and join the community.</span></p>
        </div>
        <div className='interact'>
          <Image src={item} alt="hero" />
          { !user && <Link href="#mid">Sign up or log in</Link> }
          <Link href="/dashboard">Check out your dashboard</Link>
        </div>
        <motion.div animate={{ rotate: [10, 5, 10], z: 100 }} transition={{ repeatType: 'loop', repeat: Infinity, repeatDelay: 2 }} id="postit">
          <span>Thanks for visiting!</span>
        </motion.div>
      </header>

      <motion.div layout className="mid" id="mid">


        <p>
          <span>Start testing your knowledge! </span>
          { !isMobile && <Image src={arrow} alt="arrow"/> }
        </p>
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

