import Link from 'next/link'
import Image from 'next/image'
import img from '../../../public/pngs/dashboard.png'
import styles from './DashboardPanel.module.css'
export default function DashboardPanel () {
    return (
        <section className={styles.DashboardPanel}>
          <div>
            <div>
              <h3>Check out your dashboard</h3>
              <Link href="/dashboard">Click me</Link>
            </div>
            <Image src={img} alt="dashboard icon" />
          </div>
        </section>
    )
}