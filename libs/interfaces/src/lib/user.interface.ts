export enum UserRole {
    Teacher = 'teacher',
    Student = 'student',
}

export interface IUser {
    _id?: string;
    displayName?: string;
    email: string;
    passwordHash: string;
    role: UserRole;
}
