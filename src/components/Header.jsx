'use client';

import Image from 'next/image'
import Link from 'next/link';
import styles from '@/styles/components/header.module.scss'
import userIcon from '@assets/icons/user.svg'
import moonIcon from '@assets/icons/moon.svg'
import bellIcon from '@assets/icons/bell.svg'
import { useAuth } from '@/context/AuthContext';

export default function Header() {
    const { user, isAuthenticated } = useAuth();

    return (
        <header className={styles.wrapper}>
            <div className="container">
                <div className={styles.content}>
                    {isAuthenticated ? (
                        <div className={styles.profile}>
                            <Link 
                                href="/profile"
                                className={`${styles.icon} ${styles.iconUser}`}
                            >
                                <Image className={styles.iconImage} src={userIcon} width={24} height={24} alt="user" />
                            </Link>
                            <span className={styles.username}>{user?.username}</span>
                        </div>
                    ) : (
                        <Link href="/auth/login" className={styles.login}>
                            <Image className={styles.iconImage} src={userIcon} width={24} height={24} alt="user" />
                        </Link>
                    )}
                    <div className={styles.actions}>
                        <button type='button' className={styles.themeButton}>
                            <Image className={styles.iconImage} src={moonIcon} width={24} height={24} alt="theme change" />
                        </button>
                        <button type='button' className={`${styles.icon} ${styles.iconNotification}`}>
                            <Image className={styles.iconImage} src={bellIcon} width={24} height={24} alt="notification" />
                        </button>
                    </div>
                </div>
            </div>
        </header>
    )
}
