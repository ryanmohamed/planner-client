import Link from 'next/link'
import styles from './QuizLink.module.css'

export default function QuizLink ({question}: any) {
    return (
        <div className={styles.QuizLink}>

            <Link href="#">
                <h1>{question.title}</h1>
            </Link>

            <h2>{question.subject}</h2>
            <p>{question.questions.length} questions</p>
            <div>Posted by ... </div>

        </div>
    )
}