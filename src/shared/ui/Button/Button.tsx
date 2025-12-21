'use client'

import {AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode} from "react";

import styles from './Button.module.scss';
import Link from "next/link";
import clsx  from "clsx";

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'text'

type CommonProps = {
    children: ReactNode
    variant?: ButtonVariant
    className?: string
    disabled?: boolean;
}

type NativeButtonProps = CommonProps &
    ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: never
}

type LinkButtonProps = CommonProps &
    AnchorHTMLAttributes<HTMLAnchorElement> & {
    href?: string
}

type ButtonProps = NativeButtonProps | LinkButtonProps

export const Button = ({
    children,
    variant = 'primary',
    className,
    href,
    disabled = false,
    ...props
}: ButtonProps) => {
    const classes = clsx(styles.button, styles[variant], className, disabled && styles.disabled);

    if (href) {
        const linkProps = props as AnchorHTMLAttributes<HTMLAnchorElement>;

        const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
            if (disabled) e.preventDefault();
        };

        return (
            <Link href={href} className={classes} {...linkProps} onClick={handleClick}>
                {children}
            </Link>
        );
    }

    return (
        <button className={classes} disabled={disabled} {...(props as ButtonHTMLAttributes<HTMLButtonElement>)}>
            {children}
        </button>
    );
}


//Образец использования кнопок и линков
// <Button variant="primary" onClick={() => alert('clicked!')}>Primary</Button>
// <Button variant="primary" disabled>Primary Disabled</Button>

// <Link (Next.js Link)
// <Button href="/privacy-policy" variant="primary">Primary Link</Button>
// <Button href="/privacy-policy" variant="primary" disabled>Primary Link Disabled</Button>


