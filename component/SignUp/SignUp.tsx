import { ReactElement, useEffect, useRef, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from 'yup'

import styles from './SignUp.module.css'
import useFirebaseAuth from "../../hooks/useFirebaseAuth";


export interface authInfo {
    email: string,
    password: string
}

export default function SignUp () : ReactElement {
    const { SignUpWithEmailAndPassword } = useFirebaseAuth()
    const [ error, setError ] = useState(null)

    return (
        <section className={styles.SignUp}>
            <p><i>SignUp</i></p>
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
                    <Field name='email' type='email' placeholder='email' />
                    <ErrorMessage component={'span'} name='email' />

                    <Field name='password' type='password' placeholder='password' autoComplete="true" />
                    <ErrorMessage component={'span'} name='password' />

                    <Field name='confirmPassword' type='password' placeholder='confirm password' autoComplete="false" />
                    <ErrorMessage component={'span'} name='confirmPassword' />
                
                    { error && <p style={{ marginTop: '40px' }}>{error}</p> }

                    <button type='submit'>SignUp</button>
                </Form>
            </Formik>
        </section>
    )
}