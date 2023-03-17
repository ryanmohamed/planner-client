import Link from 'next/link'
import styles from './QuizLink.module.css'
import { AnimatePresence, motion, useMotionValue, useTransform } from 'framer-motion'
import ignoreCircularReferences from '../../lib/ignoreCircularReferences'

export default function QuizLink ({id, data}: any) {

    return (
        <AnimatePresence>
            <motion.div 
                key={JSON.stringify(id, ignoreCircularReferences())}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{opacity: 0, scale: 0 }}
                whileHover={{ scale: 1.05 }}
                className={styles.QuizLink}
            >

            <Link href={`/dashboard/community/${id}`}>
                <h1>{data.title}</h1>
            </Link>

            <h2>{data.subject}</h2>
            <p>{data.numQuestions} questions</p>
            <div>Posted by ... </div>
            <span>{data.rating}</span>

            </motion.div>
        </AnimatePresence>
    )
}