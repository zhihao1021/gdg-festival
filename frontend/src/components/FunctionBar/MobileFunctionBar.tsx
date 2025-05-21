import { ReactNode, useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import styles from "./MobileFunctionBar.module.scss";

const navigate = [
    {
        icon: "checklist",
        href: "/tasks",
    },
    {
        icon: "trophy",
        href: "/ranking",
    },
    {
        icon: "shopping_bag",
        href: "/shop",
    },
    {
        icon: "wall_art",
        href: "/exhibition",
    },
    {
        icon: "person",
        href: "/profile",
    }
]

let lastScrollY = 0;

function checkSelected(href: string, pathName: string): boolean {
    // if (href === "/" && pathName === "/") return true;
    // if (href !== "/" && pathName.startsWith(href)) return true;
    // return false;
    return pathName.startsWith(href);
}

export default function MobileFunctionBar(): ReactNode {
    const [show, setShow] = useState<boolean>(true);
    const [scrollHandler, setScrollHandler] = useState<() => void>();
    const [scrollDown, setScrollDown] = useState<boolean>(false);

    const location = useLocation();

    const pathName = useMemo(() => location.pathname, [location]);

    useEffect(() => {
        const handler = () => {
            setShow(window.scrollY < lastScrollY)
            setScrollDown(window.scrollY > 0);
            lastScrollY = window.scrollY;
        }

        setScrollHandler(v => {
            if (v) window.removeEventListener("scroll", v);
            window.addEventListener("scroll", handler);
            return handler;
        })
    }, []);

    useEffect(() => () => {
        if (scrollHandler) window.removeEventListener("scroll", scrollHandler);
    }, [scrollHandler]);

    return <>
        <div className={styles.mobileFunctionBar} data-show={show}>
            {
                navigate.map(data => <Link
                    key={data.icon}
                    to={data.href}
                    data-selected={checkSelected(data.href, pathName)}
                ><span className="ms">{data.icon}</span></Link>)
            }
        </div>
        <button
            className={`ms ${styles.scrollToTop}`}
            data-show={scrollDown}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >arrow_upward</button>
    </>
}