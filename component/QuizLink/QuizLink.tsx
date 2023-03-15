import Link from 'next/link'
import styles from './QuizLink.module.css'
import { motion } from 'framer-motion'
import ignoreCircularReferences from '../../lib/ignoreCircularReferences'

export default function QuizLink ({key, id, question}: any) {
    return (
        <motion.div 
            key={JSON.stringify(question, ignoreCircularReferences())}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{opacity: 0, scale: 0 }}
            className={styles.QuizLink}
        >

            <Link href={`/dashboard/community/${id}`}>
                <h1>{question.title}</h1>
            </Link>

            <h2>{question.subject}</h2>
            <p>{question.questions.length} questions</p>
            <div>Posted by ... </div>

        </motion.div>
    )
}