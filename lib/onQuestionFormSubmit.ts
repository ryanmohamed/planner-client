import useFirebaseUserContext from "../hooks/useFirebaseUserContext"
import { Timestamp } from "firebase/firestore"

const onQuestionFormSubmit = async (values: any, user: any) => {
    
    const { uid } = user
    const payload = {
        uid: uid,
        question: {
            title: values.title,
            subject: values.subject,
            questions: values.questions.map((val: any) => {
                return {
                    question: val.question,
                    type: val.type,
                    answer: val.answer,
                    choices: val.choices
                }
            }),
        },
        timestamp: Timestamp.fromDate(new Date())
    }
    console.log(payload)
    return values
    
}

export default onQuestionFormSubmit