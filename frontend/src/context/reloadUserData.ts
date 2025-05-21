import {
    createContext
} from "react";

const reloadUserDataContext = createContext<() => Promise<void>>(() => new Promise(resolve => resolve()));

export default reloadUserDataContext;
