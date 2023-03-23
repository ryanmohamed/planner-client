import styles from './SidePanel.module.css'
import Link from 'next/link'

export default function SidePanel ({}: any) {
    return (
        <nav className={styles.SidePanel}>
            <Link href="/dashboard">🏡</Link> {/* sd */}
            <Link href="/dashboard/create">📝</Link>
            <Link href="/dashboard/community">👥</Link>
            <Link href="/dashboard/yo">⚙️</Link>
            <Link href="/dashboard/yo">❌</Link>
        </nav>
    )
}