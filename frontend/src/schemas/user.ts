import { DepartmentType } from "./department"
import { GenderType } from "./gender"

export interface User {
    uid: string,
    name: string,
    score: number,
    department: DepartmentType,
    email: string,
    phone: string,
    gender: GenderType,
    is_admin: boolean,
    department_level: number,
}

export interface GlobalUser {
    uid: string,
    name: string,
    score: number,
    department: DepartmentType,
    department_level: number,
}

export interface UserCreate {
    name: string,
    email: string,
    phone: string,
    gender: GenderType,
    department: DepartmentType,
    department_level: number,
    password: string
}

export interface UserUpdate {
    name?: string,
    phone?: string,
    gender?: GenderType,
    department?: DepartmentType,
    department_level?: number,
    password?: string
    original_password?: string
}
