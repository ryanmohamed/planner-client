import { Formik, Field, ErrorMessage, FieldArray } from 'formik'
import * as Yup from 'yup'
import DynamicQuestionForms from './DynamicQuestionForms'
import { motion } from 'framer-motion'
import styles from './DynamicQuestionForms.module.css'
export default function QuestionForm () {
    return (
        <Formik 
            initialValues={{ title: '', subject: '', 
                questions: [{ 
                    question: '',
                    type: 'short',
                    choices: { a: '', b: '', c: '', d: ''},
                    answer: '', 
                    confirmed: false
                }] 
            }}
            validationSchema={ Yup.object().shape({
                title: Yup.string().required('Title required.'),
                subject: Yup.string().required('Subject required.'),
                questions: Yup.array().of(
                    Yup.object().shape({
                        question: Yup.string().required('Question required.'),
                        type: Yup.string().notOneOf(['none', null, undefined, ''], "You must select a type.").required("A type is required."),
                        choices: Yup.object({
                            a: Yup.string(),
                            b: Yup.string(),
                            c: Yup.string(),
                            d: Yup.string()
                        })
                        .when("type", {
                            is: "mc",
                            then: (schema) => Yup.object({
                                a: Yup.string().required("Choice required."),
                                b: Yup.string().required("Choice required."),
                                c: Yup.string().required("Choice required."),
                                d: Yup.string().required("Choice required.")
                            }),
                            otherwise: (schema) => schema
                        }),
                        answer: Yup.string().notOneOf(['none', '', null, undefined], "Answer required.").required("Answer required"),
                        confirmed: Yup.boolean().optional(),
                    })
                ).min(1, "Must have atleast one question.")
            }) }
            onSubmit={ (val) => { console.log(val) } }
        >
            { props => (
                <form onSubmit={props.handleSubmit}>
                    <div className={styles.Title}>
                        <input
                            name='title' 
                            type='text' 
                            onChange={props.handleChange}
                            onBlur={props.handleBlur}
                            value={props.values.title}
                            placeholder='Enter the title of your quiz' 
                        />
                        { props.errors.title && <motion.span animate={{ x: [-20, 20, -8, 8, -7, 7, 0]}} transition={{ duration: 0.5 }} id="feedback">{props.errors.title}</motion.span> }
                    </div>
                    <div className={styles.Subject}>
                        <input
                            name='subject' 
                            type='text' 
                            onChange={props.handleChange}
                            onBlur={props.handleBlur}
                            value={props.values.subject}
                            placeholder='What subject?' 
                        />
                        { props.errors.subject &&  <motion.span animate={{ x: [-20, 20, -8, 8, -7, 7, 0]}} transition={{ duration: 0.5 }} id="feedback">{props.errors.subject}</motion.span> }
                    </div>
                    <DynamicQuestionForms {...props} />
                    <motion.button whileTap={{ scale: 1.1 }} whileHover={{ scale: 1.05 }} type="submit" className={styles.Submit}>Create quiz</motion.button>
                </form>
            ) } 
        </Formik>
    )
}   