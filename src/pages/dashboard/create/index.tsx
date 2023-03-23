import DashboardLayout from "../../../../layout/DashboardLayout/DashboardLayout"
import { ReactElement, useState } from "react"
import { Formik, Form, Field, ErrorMessage, FieldArray } from 'formik'
import * as Yup from 'yup'

import styles from './Create.module.css'
import QuestionForm from "../../../../component/QuestionForm/QuestionForm"

import { useMediaQuery } from 'react-responsive'
import { motion } from 'framer-motion'

const Create = () => {
    const [ confirm, setConfirm ] = useState(false)
    const isSmall = useMediaQuery({ query: '(max-width: 1000px)' })

    return (<main className={styles.Dashboard}>
        <div>
            <h1 className="heading">Create a quiz.</h1>
            <p className="subheading">Or modify one you&apos;ve already made</p>
        </div>
        <motion.section className={styles.Create} layout>
            <blockquote>
                <h1>Use this form to begin your newest quiz.</h1>
                <p>{ isSmall ? '👇' : '👉' }</p>
            </blockquote>
            <QuestionForm />
        </motion.section>
        <blockquote>
            <h1>Edit your existing quizzes here</h1>
        </blockquote>
    </main>)
}

Create.getLayout = function getLayout(page: ReactElement) {
    return (
        <DashboardLayout>
            {page}
        </DashboardLayout>
    )
}

export default Create