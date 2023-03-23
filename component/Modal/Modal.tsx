import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import styles from './Modal.module.css'

const Modal = ({children}: any) => {
    const [ toggle, setToggle ] = useState<boolean>(false)
    return (<AnimatePresence>
        { !toggle && <motion.div
            key={"exitbutton"}
            // drag
            // dragConstraints={{ left: -200, right: 0, top: -500, bottom: 0 }}
            initial={{ scale: 0, x: '-50%'}}
            animate={{ scale: 1, x: '-50%'}}
            exit={{ scale: 0, x: '-50%' }}
            className={styles.Modal}
        >
            <span onClick={() => setToggle(true)} className={styles.Close}>❌</span>
            { children }
        </motion.div> }
    </AnimatePresence>)
}

export default Modal