import { ReactElement, useEffect, useRef, useState } from "react"
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from 'yup'

import styles from '../../src/styles/Form.module.css'
import useFirebaseAuth from "../../hooks/useFirebaseAuth"

import { motion } from 'framer-motion'

export interface authInfo {
    email: string,
    password: string
}

export default function Login ({toggler}: any) : ReactElement {
    const { LoginWithEmailAndPassword, LoginWithGoogle, LoginAnonymously } = useFirebaseAuth()
    const [ error, setError ] = useState(null)

    return (
        <motion.section 
            exit={{ opacity: 0 }}
            className={styles.Form}
        >
            <p>Login to start planning</p>
            <hr />
            <Formik 
                initialValues={{ email: '', password: '', confirmPassword: '' }}
                validationSchema={ Yup.object({
                    email: Yup.string().email('Valid email required.').required('Email required.'),
                    password: Yup.string().min(6, "Password must be more than 6 characters.").required('Password required.'),
                }) }
                onSubmit={ (val) => LoginWithEmailAndPassword( val, setError ) }
            >
                <Form>
                    <Field name='email' type='email' placeholder='Enter your email' />
                    <ErrorMessage component={'span'} name='email' />

                    <Field name='password' type='password' placeholder='Enter your password' autoComplete="true" />
                    <ErrorMessage component={'span'} name='password' />
                    
                    { error && <p style={{ marginTop: '40px' }}>{error}</p> }
                    <div><span onClick={toggler}>Make an account here</span></div>
                    <motion.button whileTap={{ scale: 1.2 }} whileHover={{ scale: 1.05 }} type='submit'>Login</motion.button>
                </Form>
            </Formik>
            <motion.button whileTap={{ scale: 1.2 }} whileHover={{ scale: 1.05 }} className={styles.Google} type='button' onClick={()=>{LoginWithGoogle(setError)}}>Sign in with Google</motion.button>
            <motion.button whileTap={{ scale: 1.2 }} whileHover={{ scale: 1.05 }} className={styles.Anon} type='button' onClick={()=>{LoginAnonymously(setError)}}>Sign in anonymously</motion.button>
            

        </motion.section>
    )
}