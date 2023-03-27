import styles from './Navbar.module.css'
import useFirebaseUserContext from '../../hooks/useFirebaseUserContext'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import useFirebaseAuth from '../../hooks/useFirebaseAuth'
import { motion, AnimatePresence, MotionConfig } from 'framer-motion'
import useMeasure from 'react-use-measure'
import ignoreCircularReferences from '../../lib/ignoreCircularReferences'
import Link from 'next/link'

import { useRouter } from 'next/router'

const d = 0.25

function ResizeablePanel({ children }: any){
    let [ ref, { height }] = useMeasure()
    return (
        <motion.ul
            animate={{ height }}
            className={styles.Dropdown}
        >
            {/* inner wrapper for content animation */}
            <AnimatePresence mode='wait'>
            <motion.div
                // doesn't rerender for the children, so we need a key that exists outside of the render cycle, that will change and cause an update
                // the most intuitive approach is to use the children themselves as a key
                // we usually get usually due to it being a complex data structure with circular references to itself
                // lets use a work around found in github issues
                key={JSON.stringify(children, ignoreCircularReferences())} // second argument mutates the passed in object
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { delay: d/2, duration: d/2 } }}
                exit={{ opacity: 0, transition: { delay: 0, duration: d/2 } }}
                ref={ref}
            >
                <div>
                    { children }
                </div>
            </motion.div>
            </AnimatePresence>
        </motion.ul>
    )
}

export default function Navbar ({children} : any) {
    const { user } = useFirebaseUserContext()
    const [ photoURL, setPhotoURL ] = useState<any>(undefined)
    const [ toggle, setToggle ] = useState(false)
    const { SignOut } = useFirebaseAuth()
    const router = useRouter()

    useEffect(() => {
        if ( user?.photoURL === null ) 
            setPhotoURL('https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/2048px-Default_pfp.svg.png')
        else
            setPhotoURL(user?.photoURL)
    }, [user])

    console.log(router.pathname)
    return (
        <nav className={styles.Navbar} style={{ color: router.pathname === '/dashboard/create' ? 'black' : 'var(--main-bg2)' }}>   
            <Link href="/"><p className={styles.Title}>Quiz-itiv</p></Link>
            { user && <div>
                <p className={styles.Name}>{ user.isAnonymous ? "Anonymous" : user.displayName == null ? user.email : user.displayName }</p>
                <Image src={photoURL} alt={"profile image"} height={30} width={30} onClick={() => setToggle(!toggle)}/>
                <MotionConfig transition={{ duration: d/2 }}>
                    <ResizeablePanel>
                    { toggle && <>
                        <li onClick={()=>setToggle(false)}>Close</li>
                        <li onClick={()=>{
                            SignOut()
                            setToggle(false)
                        }}> Logout
                        </li>
                            
                    </> }
                    </ResizeablePanel>
                </MotionConfig>
            </div> }
        </nav>
    )
} 