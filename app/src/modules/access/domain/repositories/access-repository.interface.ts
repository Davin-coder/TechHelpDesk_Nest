import { AccessPermission } from '../entities/access-permission.entity';
import { ResourceName } from '../value-objects/resource-name.vo';

export const ACCESS_REPOSITORY = 'ACCESS_REPOSITORY';

export interface IAccessRepository {
    /**
     * Get permission by id
     */
    findById(id: number): Promise<AccessPermission | null>;

    /**
     * Get all permissions
     */
    findByRoleId(roleId: number): Promise<AccessPermission[]>;

    /**
     * Return permission by a resource like roles, users, tickets
     */
    findByRoleIdAndResource( roleId: number, resource: ResourceName ): Promise<AccessPermission | null>;

    /**
     * Create a new permission
     */
    create(permission: AccessPermission): Promise<AccessPermission>;

    /**
     * Update a existing permission
     */
    update(permission: AccessPermission): Promise<AccessPermission>;

    /**
     * Delete permission by id
     */
    deleteById(id: number): Promise<void>;

    /**
     * Delete permission for a resource
     */
    deleteByRoleIdAndResource( roleId: number, resource: ResourceName ): Promise<void>;

    /**
     * Delete all permissions of role
     */
    deleteAllForRole(roleId: number): Promise<void>;
}