import { ReactNode, useCallback, useContext, useEffect, useMemo, useState } from "react";

import { User } from "@/schemas/user";
import { Gender } from "@/schemas/gender";
import { Department, DepartmentType } from "@/schemas/department";

import updateUserData from "@/api/user/updateUserData";

import InputBox from "@/components/InputBox";

import styles from "./index.module.scss";
import reloadUserDataContext from "@/context/reloadUserData";

type propsType = Readonly<{
    userData: User
}>;

export default function EditBox(props: propsType): ReactNode {
    const { userData } = props;

    const [name, setName] = useState<string>("");
    const [phone, setPhone] = useState<string>("");
    const [genderIndex, setGenderIndex] = useState<number>(0);
    const [department, setDepartment] = useState<DepartmentType>("");
    const [departmentLevel, setDepartmentLevel] = useState<number>(1);

    const [message, setMessage] = useState<string>("");

    const reloadUserData = useContext(reloadUserDataContext);

    const isVerify = useMemo(() => {
        if (name === "") return false;
        if (phone === "") return false;
        if (genderIndex < 0 || genderIndex >= Object.keys(Gender).length) return false;
        if (!Department.includes(department)) return false;
        if (departmentLevel < 1 || departmentLevel > 10) return false;

        return true;
    }, [name, phone, genderIndex, department, departmentLevel]);

    const save = useCallback(() => {
        if (!isVerify) return;

        updateUserData({
            name: name,
            phone: phone,
            gender: Object.values(Gender)[genderIndex],
            department: department,
            department_level: departmentLevel,
        }).then(() => reloadUserData()).then(() => {
            setMessage("儲存成功");
            setTimeout(() => setMessage(""), 2000);
        }).catch(() => {
            setMessage("儲存失敗")
            setTimeout(() => setMessage(""), 2000);
        })
    }, [isVerify, name, phone, genderIndex, department, departmentLevel, reloadUserData]);

    const reset = useCallback(() => {
        setName(userData.name);
        setPhone(userData.phone);
        setGenderIndex(Object.values(Gender).indexOf(userData.gender));
        setDepartment(userData.department);
        setDepartmentLevel(userData.department_level);
    }, [userData]);

    useEffect(() => {
        reset();
    }, [reset]);

    return <>
        <div className={styles.field}>
            <div className={styles.key}>姓名</div>
            <InputBox
                className={styles.inputBox}
                value={name}
                setValue={setName}
            />
        </div>
        <div className={styles.field}>
            <div className={styles.key}>電話</div>
            <InputBox
                className={styles.inputBox}
                value={phone}
                setValue={setPhone}
            />
        </div>
        <div className={styles.field}>
            <div className={styles.key}>性別</div>
            <InputBox
                className={styles.inputBox}
                value={genderIndex}
                setValue={setGenderIndex}
                options={Object.keys(Gender)}
            />
        </div>
        <div className={styles.field}>
            <div className={styles.key}>系所</div>
            <InputBox
                className={styles.inputBox}
                value={department}
                setValue={setDepartment}
                options={Department}
                error={department !== undefined && !department}
                searchMode
            />
        </div>
        <div className={styles.field}>
            <div className={styles.key}>年級</div>
            <InputBox
                className={styles.inputBox}
                value={departmentLevel}
                setValue={setDepartmentLevel}
                error={!departmentLevel || departmentLevel < 1 || departmentLevel > 10}
            />
        </div>
        <div className={styles.buttonBox}>
            <div className={styles.message}>{message}</div>
            <button className={styles.reset} onClick={reset}>重設</button>
            <button className={styles.save} onClick={save} disabled={!isVerify}>儲存資料</button>
        </div>
    </>
}