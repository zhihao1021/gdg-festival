import { ReactNode, useCallback, useEffect, useState } from "react";

import TopBar from "./components/TopBar";
import FunctionBar from "./components/FunctionBar";
import { Route, Routes } from "react-router-dom";
import HomePage from "./views/Home";
import { User } from "./schemas/user";
import getUserData from "./api/user/getUserData";
import userDataContext from "./context/userData";
import Profile from "./views/Profile";
import reloadUserDataContext from "./context/reloadUserData";
import TaskPage from "./views/Tasks";
import ManagePage from "./views/Manage";

function App(): ReactNode {

    return <>
        <TopBar />
        <Routes>
            <Route path="" element={<HomePage />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/tasks/*" element={<TaskPage />} />
            <Route path="/manage/*" element={<ManagePage />} />
        </Routes>
        {/* {children} */}
        <FunctionBar />
    </>
}


export default function AppWrap(): ReactNode {
    const [userData, setUserData] = useState<User | undefined>(undefined);

    const reloadUserData = useCallback(() => {
        return getUserData().then(userData => setUserData(userData));
    }, []);

    useEffect(() => {
        reloadUserData();
    }, [reloadUserData]);

    return <reloadUserDataContext.Provider value={reloadUserData}>
        <userDataContext.Provider value={userData}>
            <App />
        </userDataContext.Provider>
    </reloadUserDataContext.Provider>;
}
