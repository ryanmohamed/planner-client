import Link from 'next/link'
import styles from './QuizLink.module.css'
import { AnimatePresence, motion, useMotionValue, useTransform } from 'framer-motion'
import ignoreCircularReferences from '../../lib/ignoreCircularReferences'
import { useEffect, useState } from 'react'
import useFirebaseFirestore from '../../hooks/useFirebaseFirestore'
import Image from 'next/image'

export default function QuizLink ({id, data}: any) {
    const { getUser } = useFirebaseFirestore()
    const [ author, setAuthor ] = useState<any>(null)
    const [ nums, setNums ] = useState<any>(null)

    useEffect(() => {
        const arr = []
        for (let i = 0; i < Math.floor(data?.rating); i++)
            arr[i] = i
        setNums(arr)
    }, [data])

    const set = async () => {
        console.log(getUser(data?.uid))
        getUser(data?.uid)
        .then(ele => {
            console.log(ele)
            setAuthor({
                displayName: ele?.displayName || 'Anonymous',
                img_url: ele?.img_url || 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/2048px-Default_pfp.svg.png'
            })
        })
    }

    return (
        <AnimatePresence>
            <motion.div 
                key={JSON.stringify(id, ignoreCircularReferences())}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{opacity: 0, scale: 0 }}
                whileHover={{ scale: 1.05 }}
                className={styles.QuizLink}
            >

            <Link href={`/dashboard/community/${id}`}>
                <h1>{data.title}</h1>
            </Link>

            <h2>{data.subject}</h2>
            <p>{data.numQuestions} questions</p>
            
            <div className={styles.Rating}>
                <div className={styles.Amount}>
                    { nums?.map((val: any, idx: any) => (
                        <div className={styles.Segment} style={{ transform: `rotate(${270 + 75*idx}deg) skew(10deg)`, background: Number(data.rating) > 4 ? 'red' : Number(data.rating) > 2 ? 'yellow' : 'green'}}></div>
                    )) }
                    <div className={styles.Inner}>
                    <span style={{ color: Number(data.rating) > 4 ? 'red' : Number(data.rating) > 2 ? 'yellow' : 'green'}}>{Number(data.rating).toFixed(1)}</span>
                    </div>
                </div>
                
                
            </div>

            <div className={styles.Author}>
                {author && <p>{author.displayName}</p>}
                <Image src={author?.img_url || 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/2048px-Default_pfp.svg.png'} alt="poster profile pic" width={40} height={40} />
            </div>

            </motion.div>
        </AnimatePresence>
    )
}