import { Formik, Field, ErrorMessage, FieldArray } from 'formik'
import ResizeablePanel from '../ResizeablePanel/ResizeablePanel'
import { AnimatePresence, motion } from 'framer-motion'
import styles from './DynamicQuestionForms.module.css'

import Image from 'next/image'
import confirm from '../../public/svgs/confirm.svg'
import edit from '../../public/svgs/edit.svg'
import trash from '../../public/svgs/trash.svg'
import add from '../../public/svgs/add.svg'
import { useEffect, useState } from 'react'

export default function DynamicQuestionForms({values, ...props}: any) {
    const [ err, setErr ] = useState<any>(null)
    
    useEffect(() => {
        setErr(null)
    }, [values])
    return (
        <FieldArray
            name="questions"
            render={ arrayHelpers => (
                <div className={styles.DynamicQuestionForms}>
                    { values.questions  && (
                        values.questions.map((question: any, index: any) => (
                            <motion.div key={index} className={styles.QuestionContainer} style={{ filter: question.confirmed ? 'saturate(0.2)': 'none' }}>
                                
                                <div className={styles.Question}>
                                    <h1>Question {index+1}</h1>
                                    <Field name={`questions.${index}.question`} type="text" placeholder={`Question ${index+1}`} disabled={question.confirmed} />
                                    { props.errors.questions && <motion.span animate={{ x: [-20, 20, -8, 8, -7, 7, 0]}} transition={{ duration: 0.5 }} id="feedback">{props.errors.questions[index]?.question}</motion.span> }
                                </div>

                                <div className={styles.Answer}>
                                { question.type === 't/f' ? <> <div className={styles.TF}> 
                                        <p>The answer is </p>
                                        <Field as="select" name={`questions.${index}.answer`} disabled={question.confirmed}>
                                            <option value="none">Select answer</option>
                                            <option value="true">True</option>
                                            <option value="false">False</option>
                                        </Field> 
                                        
                                    </div> { props.errors.questions && <motion.span animate={{ x: [-20, 20, -8, 8, -7, 7, 0]}} transition={{ duration: 0.5 }} id="feedback">{props.errors.questions[index]?.answer}</motion.span> } </>  : 
                                    
                                    question.type === 'mc' ? <div className={styles.MC}>
                                            <Field name={`questions.${index}.choices.a`} type="text" placeholder="a) Enter choice" disabled={question.confirmed}></Field>
                                            <ErrorMessage component={'span'} name={`questions.${index}.choices.a`} />
                                            
                                            <Field name={`questions.${index}.choices.b`} type="text" placeholder="b) Enter choice" disabled={question.confirmed}></Field>
                                            <ErrorMessage component={'span'} name={`questions.${index}.choices.b`} />

                                            <Field name={`questions.${index}.choices.c`} type="text" placeholder="c) Enter choice" disabled={question.confirmed}></Field>
                                            <ErrorMessage component={'span'} name={`questions.${index}.choices.c`} />
                                            
                                            <Field name={`questions.${index}.choices.d`} type="text" placeholder="d) Enter choice" disabled={question.confirmed}></Field>
                                            <ErrorMessage component={'span'} name={`questions.${index}.choices.d`} />

                                            <div className={styles.Correct}>
                                                <p>The correct answer is </p>
                                                <Field name={`questions.${index}.answer`} as="select" disabled={question.confirmed}>
                                                    <option value="none">Select answer</option>
                                                    <option value="a">A</option>
                                                    <option value="b">B</option>
                                                    <option value="c">C</option>
                                                    <option value="d">D</option>
                                                </Field>
                                            </div>
                                            <ErrorMessage component={'span'} name={`questions.${index}.answer`} />
                                        </div> : 

                                        <>
                                            <Field name={`questions.${index}.answer`} type="text" placeholder={`Answer ${index+1}`} disabled={question.confirmed} />
                                            <ErrorMessage component={'span'} name={`questions.${index}.answer`} />
                                        </>
                                }
                                </div>

                                <div className={styles.QuestionSettings}>
                                    <Field as="select" name={`questions.${index}.type`} disabled={question.confirmed}>
                                        <option value="none">Select type</option>
                                        <option value="short">Short Answer</option>
                                        <option value="mc">Multiple Choice</option>
                                        <option value="t/f">True/False</option>
                                    </Field>
                                    

                                    <div className={styles.Buttons}>
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault()
                                                let cpy = question
                                                cpy.confirmed = !question.confirmed
                                                arrayHelpers.replace(index, cpy) // use array helpers to cause update to form values and therefore rerender     
                                            } }
                                        >
                                            <Image src={ question.confirmed ? edit : confirm } alt="confirm or edit" height={25} width={25}/>
                                        </button>

                                        { index !== 0 && <motion.button 
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 1.1 }}
                                            onClick={()=>{ 
                                                arrayHelpers.remove(index)
                                            }}
                                        >
                                             <Image src={ trash } alt="confirm or edit" height={25} width={25}/> 
                                        </motion.button> }
                                    </div>
                                </div>
                                <ErrorMessage component={'span'} name={`questions.${index}.type`} />

                            </motion.div>
                        ))
                    )}
                
                    <div className={styles.Add}>
                        <motion.button 
                            className={styles.Add} 
                            type="button" 
                            onClick={()=>{
                                if(values.questions.every((question: any) => question.confirmed === true))
                                    arrayHelpers.push({ question: '', answer: '' })
                                else
                                    setErr('All questions must be confirmed.')
                        }}>
                            <Image src={add} alt="add question" width={75} height={75}/>
                        </motion.button>
                        { err && <motion.p animate={{ x: [-20, 20, -8, 8, -7, 7, 0]}} transition={{ duration: 0.5 }}>{err}</motion.p>}
                    </div>
                </div>
            )}
        />
    )
}