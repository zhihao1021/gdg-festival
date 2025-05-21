import { CSSProperties, ReactNode, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

import { Gender } from "@/schemas/gender";
import { Department, DepartmentType } from "@/schemas/department";

import check_account_exist from "@/api/auth/check";
import login from "@/api/auth/login";

import InputBox, { InputBoxProps } from "@/components/InputBox";
import LoadingStrip from "@/components/LoadingStrip";

import styles from "./index.module.scss";
import inputFieldStyles from "./inputField.module.scss";
import register from "@/api/auth/register";
import reloadUserDataContext from "@/context/reloadUserData";

enum State {
    LOADING = -1,
    INITIAL = 0,
    LOGIN = 1,
    REGISTER = 2,
    REGISTER_DATA = 3,
    REGISTER_DEPARTMENT = 4,
}

type inputFieldPropsType<T> = Readonly<{
    icon?: string
    footer?: string
}> & InputBoxProps<T>;

function InputField<T = any>(props: inputFieldPropsType<T>): ReactNode {
    const {
        icon,
        footer,
        className,
        ...inputBoxProps
    } = props;

    return <div className={`${inputFieldStyles.inputField} ${className ?? ""}`} data-error={props.error}>
        {icon && <span className="ms">{icon}</span>}
        <InputBox className={inputFieldStyles.inputBox} {...inputBoxProps} />
        {footer && <div className={inputFieldStyles.footer}>{footer}</div>}
    </div>
}

export default function LoginBox(): ReactNode {
    const [email, setEmail] = useState<string>("");
    const [emailError, setEmailError] = useState<boolean>(false);

    const [password, setPassword] = useState<string>("");
    const [passwordError, setPasswordError] = useState<boolean>(false);

    const passwordValidateRef = useRef<HTMLInputElement>(null);
    const [passwordValidate, setPasswordValidate] = useState<string>();

    const phoneRef = useRef<HTMLInputElement>(null);
    const [name, setName] = useState<string>();
    const [phone, setPhone] = useState<string>();
    const [gender, setGender] = useState<number>(2);

    const departmentLevelRef = useRef<HTMLInputElement>(null);
    const [department, setDepartment] = useState<DepartmentType>();
    const [departmentLevel, setDepartmentLevel] = useState<number>(1);

    const [currentState, setCurrentState] = useState<State>(State.INITIAL);
    const [noLoadingState, setNoLoadingState] = useState<State>(State.INITIAL);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [showError, setShowError] = useState<boolean>(false);

    const [buttonText, setButtonText] = useState<string>("繼續");

    const reloadUserData = useContext(reloadUserDataContext);

    const inputHeight = useMemo(() => {
        if (noLoadingState === State.INITIAL) return 1;
        if (noLoadingState === State.LOGIN) return 2;
        if (noLoadingState === State.REGISTER) return 3;
        if (noLoadingState === State.REGISTER_DATA) return 3;
        if (noLoadingState === State.REGISTER_DEPARTMENT) return 2;
        return 1;
    }, [noLoadingState]);

    const showErrorMessage = useCallback((message: string) => {
        setErrorMessage(message);
        setShowError(true);
    }, []);

    const next = useCallback(() => {
        if (currentState === State.LOADING) return;
        setShowError(false);
        setCurrentState(State.LOADING);

        if (!email) {
            setEmailError(true);
            showErrorMessage("請輸入電子郵件");
            setCurrentState(State.INITIAL);
            return;
        }

        if (currentState === State.INITIAL) {
            check_account_exist(email).then(exist => {
                if (exist) {
                    setCurrentState(State.LOGIN);
                    setButtonText("登入");
                }
                else {
                    setCurrentState(State.REGISTER);
                }
            }).catch(() => {
                setEmailError(true);
                showErrorMessage("發生錯誤，請檢察電子郵件是否正確");
                setCurrentState(State.INITIAL);
            });
        }
        else if (currentState === State.LOGIN) {
            if (!password || password.length < 8) {
                setPasswordError(true);
                showErrorMessage(password ? "密碼長度不足" : "請輸入密碼");
                setCurrentState(State.LOGIN);
                return;
            }

            login({
                email: email,
                password: password
            }).then(() => {
                reloadUserData()
            }).catch(() => {
                setPassword("")
                setPasswordError(true);
                showErrorMessage("密碼錯誤");
                setCurrentState(State.LOGIN);
            });
        }
        else if (currentState === State.REGISTER) {
            setCurrentState(State.REGISTER_DATA);
        }
        else if (currentState === State.REGISTER_DATA) {
            if (!name) {
                setName("");
                showErrorMessage("請輸入顯示名稱");
                setCurrentState(State.REGISTER_DATA);
                return;
            }
            if (!phone) {
                setPhone("");
                showErrorMessage("請輸入電話號碼");
                setCurrentState(State.REGISTER_DATA);
                return;
            }

            setCurrentState(State.REGISTER_DEPARTMENT);
        }
        else if (currentState === State.REGISTER_DEPARTMENT) {
            if (!department) {
                setDepartment("");
                showErrorMessage("請選擇系所");
                setCurrentState(State.REGISTER_DEPARTMENT);
                return;
            }
            if (departmentLevel < 1 || departmentLevel > 10) {
                showErrorMessage("請輸入正確年級");
                setCurrentState(State.REGISTER_DEPARTMENT);
                return;
            }

            if (!name || !phone) return;

            register({
                email: email,
                password: password,
                name: name,
                phone: phone,
                gender: Object.values(Gender)[gender],
                department: department,
                department_level: departmentLevel
            }).then(
                () => reloadUserData()
            ).catch(() => {
                showErrorMessage("註冊失敗，請稍後再試");
                setCurrentState(State.REGISTER_DEPARTMENT);
            });
        }
    }, [currentState, email, password, name, phone, department, departmentLevel, showErrorMessage, reloadUserData]);

    useEffect(() => {
        if (currentState === State.LOADING) return;
        setNoLoadingState(currentState);
    }, [currentState]);

    return <>
        <div className={styles.mask} style={{
            "--count": inputHeight,
        } as CSSProperties}>
            <div className={styles.inputBox} style={{
                "--shift": noLoadingState > State.REGISTER ? -1 : 0
            } as CSSProperties}>
                <InputField
                    icon="email"
                    title="電子郵件"
                    className={styles.inputField}
                    disabled={currentState !== State.INITIAL}
                    value={email}
                    setValue={setEmail}
                    error={emailError}
                    onChange={() => {
                        setEmailError(false);
                        setShowError(false);
                    }}
                    next={currentState === State.INITIAL ? next : undefined}
                    focusOnEnabled
                />
                <InputField
                    icon="password"
                    title="密碼"
                    className={styles.inputField}
                    disabled={currentState !== State.LOGIN && currentState !== State.REGISTER}
                    type="password"
                    value={password}
                    setValue={setPassword}
                    error={passwordError}
                    onChange={() => {
                        setPasswordError(false);
                        setShowError(false);
                    }}
                    next={
                        currentState === State.LOGIN ? next : currentState === State.REGISTER ? () => passwordValidateRef.current?.focus() : undefined}
                    focusOnEnabled
                />
                <InputField
                    ref={passwordValidateRef}
                    icon="password"
                    title="確認密碼"
                    className={styles.inputField}
                    disabled={currentState !== State.REGISTER}
                    type="password"
                    value={passwordValidate ?? ""}
                    setValue={setPasswordValidate}
                    error={passwordValidate !== undefined && password !== passwordValidate}
                    onChange={() => {
                        setShowError(false);
                    }}
                    next={currentState === State.REGISTER ? next : undefined}
                />
            </div>
            <div className={styles.inputBox} style={{
                "--shift": noLoadingState > State.REGISTER_DATA ? -1 : noLoadingState < State.REGISTER_DATA ? 1 : 0,
            } as CSSProperties}>
                <InputField
                    icon="badge"
                    title="顯示名稱"
                    className={styles.inputField}
                    disabled={currentState !== State.REGISTER_DATA}
                    value={name ?? ""}
                    setValue={setName}
                    error={name !== undefined && !name}
                    next={currentState === State.REGISTER_DATA ? () => phoneRef.current?.focus() : undefined}
                    focusOnEnabled
                    onChange={() => setShowError(false)}
                />
                <InputField
                    ref={phoneRef}
                    icon="phone"
                    title="電話號碼"
                    className={styles.inputField}
                    disabled={currentState !== State.REGISTER_DATA}
                    value={phone ?? ""}
                    setValue={setPhone}
                    error={phone !== undefined && !phone}
                    next={currentState === State.REGISTER_DATA ? next : undefined}
                    onChange={() => setShowError(false)}
                />
                <InputField
                    icon="wc"
                    className={styles.inputField}
                    disabled={currentState !== State.REGISTER_DATA}
                    value={gender}
                    setValue={setGender}
                    options={Object.keys(Gender)}
                />
            </div>
            <div className={styles.inputBox} style={{
                "--shift": noLoadingState < State.REGISTER_DEPARTMENT ? 1 : 0,
            } as CSSProperties}>
                <InputField
                    icon="local_library"
                    className={styles.inputField}
                    title="系所"
                    disabled={currentState !== State.REGISTER_DEPARTMENT}
                    value={department ?? ""}
                    setValue={setDepartment}
                    next={currentState === State.REGISTER_DEPARTMENT ? () => departmentLevelRef.current?.focus() : undefined}
                    options={Department}
                    error={department !== undefined && !department}
                    searchMode
                    focusOnEnabled
                    onChange={() => setShowError(false)}
                />
                <InputField
                    ref={departmentLevelRef}
                    icon="school"
                    className={styles.inputField}
                    title="年級"
                    disabled={currentState !== State.REGISTER_DEPARTMENT}
                    value={departmentLevel}
                    setValue={setDepartmentLevel}
                    next={next}
                    error={!departmentLevel || departmentLevel < 1 || departmentLevel > 10}
                    onChange={() => setShowError(false)}
                />
            </div>
        </div>
        <div className={styles.errorBox} data-show={showError}>
            <div className={styles.errorMessage}>{errorMessage}</div>
        </div>
        <button
            className={styles.continue}
            data-loading={currentState === State.LOADING}
            onClick={next}
            disabled={
                currentState === State.LOADING ||
                (currentState === State.INITIAL && !email) ||
                (currentState === State.LOGIN && !password) ||
                (currentState === State.REGISTER && password !== passwordValidate) ||
                (currentState === State.REGISTER_DATA && (!name || !phone)) ||
                (currentState === State.REGISTER_DEPARTMENT && !department)
            }
        >
            <div className={styles.text}>{buttonText}</div>
            <LoadingStrip className={styles.loadingStrip} show={currentState === State.LOADING} />
        </button>
    </>
}