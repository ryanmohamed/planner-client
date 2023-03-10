import styles from './NotLoggedIn.module.css'
import Image from 'next/image'
import img from '../../public/svgs/lock.svg'
export default function NotLoggedIn () {
    return (<main className={styles.Main}>
        <Image src={img} alt="lock icon" width={100} height={100}/>
        <h1> You're not signed in </h1>
        <p> Unfortunately you cannot access this page </p>
    </main>)
}