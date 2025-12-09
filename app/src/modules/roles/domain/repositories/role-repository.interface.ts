import { PaginationOptions, PaginatedResult } from '../../../../common/types/pagination.interface';
import { Role } from '../entities/role.entity';
import { RoleName } from '../value-objects/role-name.vo';

export const ROLE_REPOSITORY = 'ROLE_REPOSITORY';

export interface IRoleRepository {
    /**
     * get role by id.
     * @param id Role Identifier
     * @returns Role | NULL
     */
    findById(id: number): Promise<Role | null>;

    /**
     * Get role by name.
     * @param name Value Object RoleName
     * @returns Role | NULL
     */
    findByName(name: RoleName): Promise<Role | null>;

    /**
     * Returns list of roles.
     * @param options Pagination options
     */
    findAll(options: PaginationOptions): Promise<PaginatedResult<Role>>;

    /**
     * Create a new role on the database
     * @param role Entidad de dominio Role
     * @returns Role persistido (con id asignado)
     */
    create(role: Role): Promise<Role>;

    /**
     * Update an existing role.
     *
     * @param role Role domain entity with changes
     * @returns Role updated
     */
    update(role: Role): Promise<Role>;

    /**
     *
     * @param id Role Identifier
     */
    deleteById(id: number): Promise<void>;

    /**
     * Verify the role exist
     */
    existsByName(name: RoleName): Promise<boolean>;
}