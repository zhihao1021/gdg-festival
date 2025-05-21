import {
    createContext
} from "react";

const reloadTaskDataContext = createContext<() => Promise<any>>(() => new Promise(() => { }));

export default reloadTaskDataContext;
