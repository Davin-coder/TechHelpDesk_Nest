export interface AuthUser {
    id: number;
    roleId: number;
    username?: string;
    email?: string;
    isActive: boolean;
}