import { ReactNode, useMemo } from "react";

import styles from "./index.module.scss";

type propsType = Readonly<{
    show: number | boolean,
    className?: string
    fullWidth?: boolean
}>

export default function LoadingStrip(props: propsType): ReactNode {
    const { show, className } = props;

    const dataShow = useMemo(() => {
        if (typeof show === "boolean") {
            return show ? "SHOW" : "HIDDEN";
        }

        return show === 0 ? "SHOW" : show > 0 ? "RIGHT" : "LEFT";
    }, [show]);

    return <div
        className={`${styles.loadingStrip} ${className}`}
        data-show={dataShow}
        data-no-animation={typeof show === "boolean"}
    >
        <div className={styles.box}>
            <div className={styles.strip} data-fullwidth={props.fullWidth} />
        </div>
    </div>;
}