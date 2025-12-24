import styles from './RadioGroup.module.scss';

export interface RadioOption {
    label: string;
    value: string;
}

interface RadioGroupProps {
    options: RadioOption[];
    value: string | null;
    onChange: (value: string) => void;
    disabled?: boolean;
    name?: string;
}


export const RadioGroup = ({
                                                          options,
                                                          value,
                                                          onChange,
                                                          disabled = false,
                                                          name = 'radio-group',
                                                      }:RadioGroupProps) => {
    return (
        <div className={styles.group} aria-disabled={disabled}>
            {options.map(option => {
                const checked = value === option.value;


                return (
                    <label
                        key={option.value}
                        className={styles.radio}
                        data-checked={checked}
                        data-disabled={disabled}
                    >
                        <input
                            type="radio"
                            name={name}
                            value={option.value}
                            checked={checked}
                            disabled={disabled}
                            onChange={() => onChange(option.value)}
                        />
                        <span className={styles.control} />
                        <span className={styles.label}>{option.label}</span>
                    </label>
                );
            })}
        </div>
    );
};



//Пример использования
// const [value, setValue] = useState<string | null>('one');
// <RadioGroup
//     options={[
//         { label: 'Pipiska', value: 'one' },
//         { label: 'Zhopa', value: 'two' },
//         { label: 'React', value: 'three' },
//     ]}
//     value={value}
//     onChange={setValue}
// />