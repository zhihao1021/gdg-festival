"use client";
import { CSSProperties, DetailedHTMLProps, InputHTMLAttributes, ReactNode, RefObject, useEffect, useMemo, useRef, useState } from "react";

import styles from "./index.module.scss";

type propsType<T> = Readonly<{
    error?: boolean,
    title?: string,
    disabled?: boolean,
    next?: () => void,
    value?: T,
    setValue?: (value: T) => void,
    focusOnEnabled?: boolean,
    options?: Array<string>,
    searchMode?: boolean
}> & DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;

export type { propsType as InputBoxProps };

export default function InputBox<T = any>(props: propsType<T>): ReactNode {
    const {
        error,
        className,
        title,
        disabled,
        next,
        setValue,
        focusOnEnabled,
        onKeyDown,
        onChange,
        ref,
        options,
        searchMode,
        value,
        ...rest
    } = props;

    const customRef = useRef<HTMLInputElement>(null);
    const [tempValue, setTempValue] = useState<string>((value ?? "") as string);

    const showOptions = useMemo(() => {
        if (!options) return [];
        if (!tempValue) return options;
        return options.filter(v => v.includes(tempValue));
    }, [tempValue, options]);

    useEffect(() => {
        if (!focusOnEnabled || disabled || disabled === undefined) return;

        const element = ((ref || customRef) as RefObject<HTMLInputElement>).current;
        if (!element) return;

        element.focus({ preventScroll: true });
    }, [focusOnEnabled, disabled, ref]);

    useEffect(() => {
        if (typeof value === "string")
            setTempValue(value);
    }, [value]);

    return <div className={`${styles.inputBox} ${className}`} data-has-search={searchMode} data-options-count={tempValue.length === 0 ? 0 : Math.min(3, showOptions.length)}>
        {title && <span className={styles.title} data-no-context={searchMode ? !tempValue : !props.value}>{title}</span>}
        {
            options && !searchMode ? <div className={styles.options}>
                {options.map((option, index) => <div
                    key={index}
                    className={styles.option}
                    data-selected={value === index}
                    onClick={disabled ? undefined : () => setValue?.(index as T)}
                ><span>{option}</span></div>)}
            </div> : <input
                {...rest}
                ref={ref || customRef}
                data-error={error === true}
                value={searchMode ? tempValue : value}
                onChange={!disabled ? event => {
                    onChange?.(event);
                    if (searchMode) {
                        setTempValue(event.target.value);
                        if (options?.includes(event.target.value)) {
                            setValue?.(event.target.value as T);
                        }
                        else {
                            setValue?.("" as T);
                        }
                    }
                    else if (setValue) setValue(event.target.value as T);
                } : undefined}
                onKeyDown={(e) => {
                    onKeyDown?.(e);
                    if (e.key === "Enter" && !disabled) next?.();
                }}
                disabled={disabled}
            />
        }
        {
            options && searchMode && <div className={styles.searchOptionsMask} style={{
                "--options-count": tempValue.length === 0 ? 0 : showOptions.length,
            } as CSSProperties}>
                {!disabled && <div className={styles.searchOptions}>
                    {showOptions.map((option, index) => <div
                        key={index}
                        className={styles.option}
                        onClick={disabled ? undefined : () => {
                            setTempValue(option);
                            setValue?.(option as T);
                        }}
                    >{option}</div>)}
                </div>}
            </div>
        }
    </div>;
}
