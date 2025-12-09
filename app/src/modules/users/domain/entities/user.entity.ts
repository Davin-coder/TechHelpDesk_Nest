import { Username } from '../value-objects/username.vo';
import { UserEmail } from '../value-objects/user-email.vo';
import { PasswordHash } from '../value-objects/password-hash.vo';

export class User {
    private constructor(
        private readonly _id: number | null,
        private _username: Username,
        private _email: UserEmail,
        private _passwordHash: PasswordHash,
        private _roleId: number,
        private _isActive: boolean,
        private readonly _createdAt: Date,
    ) {}
    static create(params: {
        id?: number | null;
        username: Username;
        email: UserEmail;
        passwordHash: PasswordHash;
        roleId: number;
        isActive?: boolean;
        createdAt?: Date | null;
    }): User {
        const id = params.id ?? null;
        const isActive = params.isActive ?? true;
        const createdAt = params.createdAt ?? new Date();
        return new User(
            id,
            params.username,
            params.email,
            params.passwordHash,
            params.roleId,
            isActive,
            createdAt,
        );
    }
    // getters
    get id(): number | null {
        return this._id;
    }
    get username(): Username {
        return this._username;
    }
    get email(): UserEmail {
        return this._email;
    }
    get passwordHash(): PasswordHash {
        return this._passwordHash;
    }
    get roleId(): number {
        return this._roleId;
    }
    get isActive(): boolean {
        return this._isActive;
    }
    get createdAt(): Date {
        return this._createdAt;
    }

    // Domain
    changeUsername(username: Username): void {
        this._username = username;
    }
    changeEmail(email: UserEmail): void {
        this._email = email;
    }
    changePasswordHash(passwordHash: PasswordHash): void {
        this._passwordHash = passwordHash;
    }
    changeRole(roleId: number): void {
        this._roleId = roleId;
    }
    deactivate(): void {
        this._isActive = false;
    }
    activate(): void {
        this._isActive = true;
    }
}