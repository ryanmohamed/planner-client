import { ReactElement, useEffect, useRef, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from 'yup'

import styles from '../../src/styles/Form.module.css'
import useFirebaseAuth from "../../hooks/useFirebaseAuth";

import { motion } from 'framer-motion'

export interface authInfo {
    email: string,
    password: string
}

export default function SignUp ({toggler}: any) : ReactElement {
    const { SignUpWithEmailAndPassword, LoginWithGoogle, LoginAnonymously } = useFirebaseAuth()
    const [ error, setError ] = useState(null)

    return (
        <motion.section 
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className={styles.Form}
        >
            
            <p>Make an account</p>
            <hr />
            <Formik 
                initialValues={{ email: '', password: '', confirmPassword: '' }}
                validationSchema={ Yup.object({
                    email: Yup.string().email('Valid email required.').required('Email required.'),
                    password: Yup.string().min(6, "Password must be more than 6 characters.").required('Password required.'),
                    confirmPassword: Yup.string()
                        .oneOf([Yup.ref('password')], 'Passwords must match')
                }) }
                onSubmit={ (val) => SignUpWithEmailAndPassword( val, setError ) }
            >
                <Form>
                    <Field name='email' type='email' placeholder='Enter your email' />
                    <ErrorMessage component={'span'} name='email' />

                    <Field name='password' type='password' placeholder='Enter your password' autoComplete="true" />
                    <ErrorMessage component={'span'} name='password' />

                    <Field name='confirmPassword' type='password' placeholder='Enter your password again' autoComplete="false" />
                    <ErrorMessage component={'span'} name='confirmPassword' />
                
                    { error && <p style={{ marginTop: '40px' }}>{error}</p> }
                    <div><span onClick={toggler}>Already have an account? Login here.</span></div>
                    <button type='submit'>Sign up</button>
                </Form>
            </Formik>
            <motion.button whileTap={{ scale: 1.2 }} whileHover={{ scale: 1.05 }} className={styles.Google} type='button' onClick={()=>{LoginWithGoogle(setError)}}>Sign in with Google</motion.button>
            <motion.button whileTap={{ scale: 1.2 }} whileHover={{ scale: 1.05 }} className={styles.Anon} type='button' onClick={()=>{LoginAnonymously(setError)}}>Sign in anonymously</motion.button>
        </motion.section>
    )
}