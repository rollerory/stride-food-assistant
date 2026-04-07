import Image from 'next/image'
import styles from '@/styles/components/header.module.scss'
import userIcon from '@assets/icons/user.svg'
import moonIcon from '@assets/icons/moon.svg'
import bellIcon from '@assets/icons/bell.svg'


export default function Header() {
    return (
        <header className={styles.header}>
            <div className="container">
                <div className={styles.header__inner}>
                    <button type='button' className={`${styles.header__icon}  ${styles.header__user}`}>
                        <Image src={userIcon} width={24} height={24} alt="user" />
                    </button>
                    <div className={styles.header__hug}>
                        <button type='button' className={styles.header__theme}>
                            <Image src={moonIcon} width={24} height={24} alt="theme change" />
                        </button>
                        <button type='button' className={`${styles.header__icon} ${styles.header__notification}`}>
                            <Image src={bellIcon} width={24} height={24} alt="notification" />
                        </button>
                    </div>
                </div>
            </div>
        </header>
    )
}
