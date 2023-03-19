declare module "QuizHeaderType" {
    export type QuizHeader = {
        title: string,
        subject: string,
        author: string,
        img_url: string,
        num_questions: number,
        rating: number,
        id: string
    }
}