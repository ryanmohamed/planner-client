import styles from './Question.module.css'
import { Field, ErrorMessage, Form, Formik } from 'formik'
import * as Yup from 'yup'
import useFirebaseFirestore from '../../hooks/useFirebaseFirestore'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const Short = (props: any) => {
    const { idx, lock } = props
    return (<>
        <Field as="textarea" name={`answers.${idx}`} placeholder="Enter your answer" disabled={lock}/>
    </>)
}

const MultipleChoice = ({ lock, choices, idx }: any) => {
    const { a,b,c,d } = choices
    return (<>
        <label>
            <Field type="radio" name={`answers.${idx}`} value='a'  disabled={lock} />
            {a}
        </label>
        <label>
            <Field type="radio" name={`answers.${idx}`} value='b' disabled={lock}  />
            {b}
        </label>
        <label>
            <Field type="radio" name={`answers.${idx}`} value= 'c' disabled={lock} />
            {c}
        </label>
        <label>
            <Field type="radio" name={`answers.${idx}`} value='d'  disabled={lock} />
            {d}
        </label>
    </>)
}

const TrueOrFalse = (props: any) => {
    const { idx, lock } = props
    return (<>
        <label>
            <Field type="radio" name={`answers.${idx}`} value="true" disabled={lock} />
            True
        </label>
        <label>
            <Field type="radio" name={`answers.${idx}`} value="false" disabled={lock} />
            False
        </label>
    </>)
}
 
const Question = (props: any) => {
    const { question, type, choices } = props.question
    const { idx, children } = props
  
    return (
        <motion.div 
            className={styles.Question} 
            key={idx}
        >
            <h1>{question}</h1>
            <p>Answer: 👇</p>
            <div className={styles.FieldContainer}>
                {type === 'short' ? <Short lock={false} idx={idx} /> : type === 'mc' ? <MultipleChoice choices={choices} lock={false} idx={idx}/> : <TrueOrFalse lock={false} idx={idx} /> }
                <ErrorMessage component={'span'} name={`answers.${idx}`} />
                { children }
            </div>

        </motion.div>
    )
}

export default Question