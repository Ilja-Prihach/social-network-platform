'use client'
import styles from './Alert.module.scss';
import {useState} from "react";
import clsx from "clsx";
import {Button} from "@/shared/ui/Button/Button";

type AlertVariant = "success" | "error";

type AlertProps = {
    text: string;
    variant: AlertVariant;
    className?: string;
};

export const Alert = ({text, variant, className}: AlertProps) => {
    const [isOpen, setIsOpen] = useState(true);
    if(!isOpen) return null

    return (
        <div className={clsx(styles.alert, styles[variant], className)}>
            <span>{text}</span>
            <Button variant="text" onClick={() => setIsOpen(false)} className={styles.closeButton}>
                <div>X</div>
            </Button>
        </div>
    )
}