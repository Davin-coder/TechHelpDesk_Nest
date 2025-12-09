import { PaginationOptions, PaginatedResult } from '../../../../common/types/pagination.interface';
import { User } from '../entities/user.entity';
import { Username } from '../value-objects/username.vo';
import { UserEmail } from '../value-objects/user-email.vo';
import { PasswordHash } from '../value-objects/password-hash.vo';

export const USER_REPOSITORY = 'USER_REPOSITORY';

export interface UserListFilters {
    isActive?: boolean;
    roleId?: number;
    search?: string;
}

export interface IUserRepository {
    /**
     * Get a user by id
     */
    findById(id: number): Promise<User | null>;

    /**
     * Get a user by username
     */
    findByUsername(username: Username): Promise<User | null>;

    /**
     * Get a user by email
     */
    findByEmail(email: UserEmail): Promise<User | null>;

    /**
     * List user with pagination
     */
    findAll(
        options: PaginationOptions,
        filters?: UserListFilters,
    ): Promise<PaginatedResult<User>>;

    /**
     * Create a new user in the persistence
     */
    create(user: User): Promise<User>;

    /**
     * Update a user by id
     */
    update(user: User): Promise<User>;

    /**
     * Delete user by id
     */
    deleteById(id: number): Promise<void>;

    /**
     * Verify user exists by username
     */
    existsByUsername(username: Username): Promise<boolean>;

    /**
     * Verify user exists by email
     */
    existsByEmail(email: UserEmail): Promise<boolean>;

    /**
     * Update the hash
     */
    updatePasswordHash(
        userId: number,
        passwordHash: PasswordHash,
    ): Promise<void>;
}