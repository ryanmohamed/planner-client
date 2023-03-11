import DashboardLayout from "../../../../layout/DashboardLayout/DashboardLayout"
import { ReactElement, useState } from "react"
import { Formik, Form, Field, ErrorMessage, FieldArray } from 'formik'
import * as Yup from 'yup'

import defaultStyles from '../Dashboard.module.css'
import styles from './Create.module.css'

const Create = () => {
    const [ confirm, setConfirm ] = useState(false)
    return (<main className={defaultStyles.Dashboard}>
        <div>
            <h1 className="heading">Create a quiz.</h1>
            <p className="subheading">Or modify one you've already made</p>
        </div>
        <section className={styles.Create}>
            <Formik 
                initialValues={{ title: '', subject: '', 
                    questions: [{ 
                        question: 'This is a question',
                        answer: 'This is an answer', 
                        confirmed: true
                    }] 
                }}
                onSubmit={ (val) => {} }
                render={({values}) => <>
                    <Form>
                        <Field name='title' type='text' placeholder='Enter the title of your quiz' />
                        <ErrorMessage component={'span'} name='title' />

                        <Field name='subject' type='text' placeholder='What subject?' />
                        <ErrorMessage component={'span'} name='subject' />

                        <FieldArray
                            name="questions"
                            render={ arrayHelpers => (
                                <div>
                                    { values.questions  && (
                                        values.questions.map((question, index) => (
                                            <div key={index}>
                                                <Field name={`questions.${index}.question`} type="text" placeholder={`Question ${index+1}`} disabled={question.confirmed} />
                                                <Field name={`questions.${index}.answer`} type="text" placeholder={`Answer ${index+1}`} disabled={question.confirmed} />
                                                <button onClick={()=>{ question.confirmed = !question.confirmed }}>{ !question.confirmed ? 'Confirm' : 'Modify'}</button>
                                            </div>
                                        ))
                                    )}
                                
                                    <button type="button" onClick={()=>{
                                        if(values.questions.every(question => question.confirmed === true)) {
                                            arrayHelpers.push({ question: '', answer: '' })
                                        }
                                    }}>
                                        add question
                                    </button>
                                </div>
                            )}
                        />
                    </Form>
                </>}
            />
        </section>
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