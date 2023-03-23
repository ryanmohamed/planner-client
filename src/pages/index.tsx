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
import me from '../../public/pngs/me.jpeg'
import quiz1 from '../../public/pngs/quiz1.jpg'
import down from '../../public/svgs/down-arrow.svg'
import Link from 'next/link'

import { useMediaQuery } from 'react-responsive'

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
        <title>Quiz-itiv</title>
        <meta name="description" content="Intuitive quiz based social media." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="landing">
        <div className='action'>
          <h1>Welcome to your newest proctor.</h1>
          <p><span>Take quizzes or create your own.</span> <span>Learn and gain xp, get access to easter eggs and special features.</span> <span>Post and join the community.</span></p>
        </div>
        <div className='interact'>
          <Image src={item} alt="hero" />
          { user === null && <a href="#mid">Sign up or log in</a> }
          <Link href="/dashboard">Check out your dashboard</Link>
        </div>
        <motion.div animate={{ rotate: 2, z: 100 }} transition={{ rotate: { stiffness: 50, damping: 0, type: "spring", repeatType: 'loop', repeat: Infinity } }} id="postit">
          <span>Thanks for visiting!</span>
        </motion.div>
      </header>

      {
        !user && <motion.div layout className="mid" id="mid">
          <p>
            <span>Start testing your knowledge! 
              <Image src={arrow} alt="arrow"/>
            </span>
          </p>
          <MotionConfig transition={{ duration: 5 }}>
          { user === null && <section>
            <AnimatePresence mode='wait'>
              { toggle ? <SignUp toggler={()=>setToggle(false)}/> : <Login toggler={()=>setToggle(true)} /> }
            </AnimatePresence>
          </section> }
          </MotionConfig>
        </motion.div>
      }

      <div className="background">

        <div id="arrowdown">
        <Image src={down} alt="go down" fill/>
        </div>

        <motion.blockquote initial={{opacity: 0, x: -50 }} whileInView={{opacity: 1, x: 0 }}  transition={{ duration:  1 }} >
          <div>
            <Image src={me} alt="creator photo" width={200} height={200}  style={{ borderRadius: '50%' }}/>
            <span id="source">Ryan Mohamed</span>
            <span>Software Engineer</span>
            <span>Code Coach</span>
          </div>
          <p>
            <em>Hey there! </em>
            <b>Quiz-itiv</b> is a <b>quiz-based</b> social media platform where you can <b style={{color:"orange", letterSpacing: "0"}}>create quizzes in any subject</b> and gain <b style={{color:"limegreen"}}>XP</b> by trying your luck at the quizzes made by others.
          </p>
        </motion.blockquote>

        <motion.blockquote initial={{opacity: 0, x: 50 }} whileInView={{opacity: 1, x: 0 }}  transition={{ duration:  1 }} >
          <p>
            <em style={{color:"limegreen"}}>XP </em>
            grants you some <b>secret abilities</b> across the site. So head to your <b><Link href="/dashboard">dashboard</Link></b> to start exploring!
          </p>
        </motion.blockquote>

        <motion.blockquote initial={{opacity: 0, x: -50 }} whileInView={{opacity: 1, x: 0 }}  transition={{ duration:  1 }} >
          <p>
            I was inspired to create <b>Quiz-itiv</b> through my time <b style={{color:"limegreen"}}>working with students</b> learn programming. 
          </p>
        </motion.blockquote>

        

        <motion.blockquote initial={{opacity: 0, x: 50 }} whileInView={{opacity: 1, x: 0 }}  transition={{ duration:  1 }} >
          <p>
            Every student is <b>unique</b> and learns in their own way, but I find that we all strive in a <b style={{color: "orange"}}>reward-based</b> learning setting.
          </p>
        </motion.blockquote>

        <motion.blockquote initial={{opacity: 0, x: -50 }} whileInView={{opacity: 1, x: 0 }}  transition={{ duration:  1 }} >
          <p>
            Rewards don&apos;t have to be physical items, instead they can be simply <b style={{color: "limegreen"}}>raising your XP cap in your favorite RPG</b>. Why not apply this same idealogly to <b style={{color: "orange"}}>learning?</b>
          </p>
        </motion.blockquote>

      </div>

      <footer>
        <h1>Quiz-itiv</h1>
        <div>
          <ul>
            <h2>Contact us</h2>
            <li>Email</li>
            <li>LinkedIn</li>
            <li>Symplicity</li>
          </ul>
          <ul>
            <h2>Contribute</h2>
            <li>Email</li>
            <li>Github</li>
          </ul>
        </div>
      </footer>

    </>
  )
}

