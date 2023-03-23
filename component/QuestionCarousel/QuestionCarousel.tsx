import styles from './QuestionCarousel.module.css'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { wrap } from 'popmotion'
import Question from '../Question/Question'
import useMeasure from 'react-use-measure'
import Image from 'next/image'

// courtesy of matt g perry - https://codesandbox.io/s/framer-motion-image-gallery-pqvx3?from-embed=&file=/src/Example.tsx:197-520
const variants = {
  enter: (direction: number) => {
    return {
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.5
    }
  },
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
    scale: 1
  },
  exit: (direction: number) => {
    return {
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.5
    }
  }
}

const QuestionCarousel = ({questions, score}: any) => {
    // includes direction to use enter/exit variants in altering ways
    const [[page, direction], setPage] = useState([0, 0])
    
    // courtesy of matt g perry - https://codesandbox.io/s/framer-motion-image-gallery-pqvx3?from-embed=&file=/src/Example.tsx:197-520
    const quizIdx = wrap(0, questions.length, page) // wraps page around based on our first two arguments
    const paginate = (newDirection: number) => {
        setPage([page + newDirection, newDirection])
    }

    // we need the carousel to grow larger when necessary
    const [ref, {height}] = useMeasure()

    return (<>

        <AnimatePresence initial={false} mode="wait">
          
          <motion.div className={styles.Carousel} animate={{ height: height }} transition={{
                          height: { type: "spring", stiffness: 300, damping: 30 },
                      }}>
              <AnimatePresence initial={false} custom={direction} mode="sync">
                  <motion.div
                      ref={ref}
                      className={styles.QuestionContainer}
                      key={page} 
                      custom={direction} // custom arguments for function variants
                      variants={variants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{
                          x: { type: "spring", stiffness: 300, damping: 30 },
                          opacity: { duration: 0.2 },
                          scale: { duration: 0.2 }
                      }}
                  >
                      <Question question={questions[quizIdx]} idx={quizIdx}>
                      { (score) && <p>Answer: {score.answer_key[quizIdx]}</p> }
                      </Question>
                  </motion.div>
              </AnimatePresence>

              <div className={styles.next} onClick={() => paginate(1)}>{"‣"}</div>
              <div className={styles.prev} onClick={() => paginate(-1)}>{"‣"}</div>
          </motion.div>
        </AnimatePresence>

    </>)
}

export default QuestionCarousel 