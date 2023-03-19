declare module "QuizData" {

    export type QuestionData = {
        question: string,
        type: string, 
        choices: {
            a: string, 
            b: string,
            c: string,
            d: string
        }
    }

    export type QuizData = {
        title: string,
        subject: string,
        author: string,
        img_url: string,
        questions: QuestionData[],
        attempts: number,
        rating: number,
        timestamp: any
    }
    
}