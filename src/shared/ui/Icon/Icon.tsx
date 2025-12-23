'use client';

type IconPropsType = {
    iconId: string,
    width?: string,
    height?: string,
    viewBox?: string,
    className?: string,
    color?: string
}

export const Icon = (props: IconPropsType) => {
    return (
        <svg
            width={props.width || "24"}
            height={props.height || "24"}
            viewBox={props.viewBox || "0 0 24 24"}
            fill={props.color || "currentColor"}
            className={props.className}
            xmlns="http://www.w3.org/2000/svg"
        >
            <use href={`#${props.iconId}`} /> {/* Измените здесь */}
        </svg>
    );
};