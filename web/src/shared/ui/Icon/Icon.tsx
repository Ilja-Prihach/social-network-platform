'use client';

/*Пример использования : <Icon iconId="plus-square-outline" style={{ color: 'red' }} />*/

type IconPropsType = {
    iconId: string,
    width?: string,
    height?: string,
    viewBox?: string,
    className?: string,
    color?: string,
    style?: React.CSSProperties
}

export const Icon = (props: IconPropsType) => {
    return (
        <svg
            width={props.width || "24"}
            height={props.height || "24"}
            viewBox={props.viewBox || "0 0 24 24"}
            fill={props.color || "currentColor"}
            className={props.className}
            style={props.style}
            xmlns="http://www.w3.org/2000/svg"
        >
            <use href={`#${props.iconId}`} />
        </svg>
    );
};