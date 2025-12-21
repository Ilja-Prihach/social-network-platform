'use client'

import {Button} from "@/src/shared/ui/Button/Button";
import styles from "./Sidebar.module.scss";

export const Sidebar = () => {
    return (
        <nav className={styles.sidebar}>
            <ul className={styles.sidebar_nav}>
                <li>
                    <Button href="/" variant="text" style={{
                        color: 'var(--light-100-color)'
                    }}>
                        <div className={styles.svg}></div>
                        <span>Feed</span>
                    </Button>
                </li>
                <li>
                    <Button href="/" variant="text" style={{
                        color: 'var(--light-100-color)'
                    }}>
                        <div className={styles.svg}></div>
                        <span>Create</span>
                    </Button>
                </li>
                <li>
                    <Button href="/" variant="text" style={{
                        color: 'var(--light-100-color)'
                    }}>
                        <div className={styles.svg}></div>
                        <span>My Profile</span>
                    </Button>
                </li>
                <li>
                    <Button href="/" variant="text" style={{
                        color: 'var(--light-100-color)'
                    }}>
                        <div className={styles.svg}></div>
                        <span>Messanger</span>
                    </Button>
                </li>
                <li>
                    <Button href="/" variant="text" style={{
                        color: 'var(--light-100-color)'
                    }}>
                        <div className={styles.svg}></div>
                        <span>Search</span>
                    </Button>
                </li>
            </ul>

            <ul  className={styles.sidebar_tools}>
                <li>
                    <Button href="/" variant="text" style={{
                        color: 'var(--light-100-color)'
                    }}>
                        <div className={styles.svg}></div>
                        <span>Statistics</span>
                    </Button>
                </li>
                <li>
                    <Button href="/" variant="text" style={{
                        color: 'var(--light-100-color)'
                    }}>
                        <div className={styles.svg}></div>
                        <span>Favourites</span>
                    </Button>
                </li>
            </ul>

            <ul className={styles.sidebar_logout}>
                <li>
                    <Button href="/" variant="text" style={{
                        color: 'var(--light-100-color)'
                    }}>
                        <div className={styles.svg}></div>
                        <span>Log Out</span>
                    </Button>
                </li>
            </ul>
        </nav>
    );
};