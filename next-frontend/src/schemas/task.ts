export interface Task {
    uid: string,
    title: string
    description: string,
    points: number,
    total_count: number,
    level: number,
    display: boolean
    release_date: number,
}


export interface TaskCreate {
    title: string,
    description: string,
    points: number,
    total_count: number,
    level: number,
    display: boolean,
    release_date: number,
}

export interface TaskUpdate {
    title?: string,
    description?: string,
    points?: number,
    total_count?: number,
    level?: number,
    display?: boolean,
    release_date?: number,
}
