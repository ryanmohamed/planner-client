import Link from 'next/link'
import styles from './QuizLink.module.css'
import { AnimatePresence, motion, useMotionValue, useTransform } from 'framer-motion'
import ignoreCircularReferences from '../../lib/ignoreCircularReferences'
import { useEffect, useState } from 'react'
import Image from 'next/image'

export default function QuizLink ({header}: any) {
    return (
        <AnimatePresence>
            <motion.div 
                key={JSON.stringify(header.id, ignoreCircularReferences())}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{opacity: 0, scale: 0 }}
                whileHover={{ scale: 1.05 }}
                className={styles.QuizLink}
            >

            <Link href={`/dashboard/community/${header.id}`}>
                <h1>{header.title}</h1>
            </Link>

            <h2>{header.subject}</h2>
            <p>{header.num_questions} questions</p>
            
            {/* <div className={styles.Rating}>
                <div className={styles.Amount}>
                    { nums?.map((val: any, idx: any) => (
                        <div className={styles.Segment} style={{ transform: `rotate(${270 + 75*idx}deg) skew(10deg)`, background: Number(data.rating) > 4 ? 'red' : Number(data.rating) > 2 ? 'yellow' : 'green'}}></div>
                    )) }
                    <div className={styles.Inner}>
                    <span style={{ color: Number(data.rating) > 4 ? 'red' : Number(data.rating) > 2 ? 'yellow' : 'green'}}>{Number(data.rating).toFixed(1)}</span>
                    </div>
                </div>
            </div> */}

            <div className={styles.Author}>
                <p>{header.author}</p>
                <Image src={header.img_url} alt="poster profile pic" width={40} height={40} />
            </div>

            </motion.div>
        </AnimatePresence>
    )
}