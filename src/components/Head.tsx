import styles from '@/styles/components/head.module.scss'
import Image from 'next/image'
import foodIcon from '@assets/icons/food.svg'

type HeadProps = {
    title: string,
    text: string
}

export default function Head({ title, text }: HeadProps) {
    return (
        <div className={styles.wrapper}>
            <h1 className={styles.title}>
                {title}
                <Image 
                    className={styles.icon} 
                    width={44}
                    height={44}
                    src={foodIcon}
                    alt="food icon" />
            </h1>
            <p className={styles.text}>
                {text}
            </p>
        </div>
    )
}
