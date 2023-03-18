import styles from './Question.module.css'
import { Field, ErrorMessage, Form, Formik } from 'formik'
import * as Yup from 'yup'
import useFirebaseFirestore from '../../hooks/useFirebaseFirestore'
import { useEffect, useState } from 'react'
import { off } from 'process'

const Short = (props: any) => {
    return (<>
        <Field as="textarea" name="answer" placeholder="Enter your answer" disabled={props.lock}/>
    </>)
}

const MultipleChoice = ({ lock, choices }: any) => {
    const { a,b,c,d } = choices
    return (<>
        <label>
            <Field type="radio" name="answer" value='a'  disabled={lock} />
            {a}
        </label>
        <label>
            <Field type="radio" name="answer" value='b' disabled={lock}  />
            {b}
        </label>
        <label>
            <Field type="radio" name="answer" value= 'c' disabled={lock} />
            {c}
        </label>
        <label>
            <Field type="radio" name="answer" value='d'  disabled={lock} />
            {d}
        </label>
    </>)
}

const TrueOrFalse = (props: any) => {
    return (<>
        <label>
            <Field type="radio" name="answer" value="true" disabled={props.lock} />
            True
        </label>
        <label>
            <Field type="radio" name="answer" value="false" disabled={props.lock} />
            False
        </label>
    </>)
}
 
const Question = (props: any) => {
    const { question, type, choices } = props.question
    const { numCompleted, setNumCompleted } = props.update
    const [ submitted, setSubmitted ] = useState<boolean>(false)
    const [ correct, setCorrect ] = useState<any>(null)
    const { checkAnswer } = useFirebaseFirestore()

    return (
        <div className={styles.Question}>

            <h1>{question}</h1>
            <Formik
                initialValues={{ answer: '' }}
                validationSchema={ Yup.object({
                    answer: Yup.string().required('Answer required.'),
                }) }
                onSubmit={ async ({answer}) => {
                    if (!submitted) {
                        await checkAnswer(props.id, props.idx, answer)
                        .then(val => {
                            setCorrect(val)
                            setNumCompleted([...numCompleted, val])
                            console.log(val)
                        })
                        setSubmitted(true)
                    }
                }} >
                <Form>
                    <p>Answer: 👇</p>
                    {type === 'short' ? <Short lock={submitted} /> : type === 'mc' ? <MultipleChoice choices={choices} lock={submitted} /> : <TrueOrFalse lock={submitted} /> }
                    <ErrorMessage component={'span'} name='answer' />
                    <button type="submit">Submit</button>
                    {/* <p>{ correct }</p> */}
                </Form>
            </Formik>
            
            { correct !== null && <p className={styles.Correct}>{correct ? 'Correct' : 'Incorrect'}</p>}

        </div>
    )
}

export default Question