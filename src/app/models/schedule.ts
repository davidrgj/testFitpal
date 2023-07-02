export interface Schedule {
    id: number | string,
    date: string,
    class_id: number | string,
    status?: number,
    created_at?: Date
}
