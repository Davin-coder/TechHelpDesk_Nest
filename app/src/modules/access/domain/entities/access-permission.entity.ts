import { ResourceName } from '../value-objects/resource-name.vo';

export class AccessPermission {
    private constructor(
        private readonly _id: number | null,
        private readonly _roleId: number,
        private _resource: ResourceName,
        private _canRead: boolean,
        private _canCreate: boolean,
        private _canUpdate: boolean,
        private _canDelete: boolean,
    ) {}
    static create(params: {
        id?: number | null;
        roleId: number;
        resource: ResourceName;
        canRead?: boolean;
        canCreate?: boolean;
        canUpdate?: boolean;
        canDelete?: boolean;
    }): AccessPermission {
        const id = params.id ?? null;
        if (!params.roleId || params.roleId <= 0) {
            throw new Error('roleId must be a positive integer');
        }
        return new AccessPermission(
            id,
            params.roleId,
            params.resource,
            params.canRead ?? false,
            params.canCreate ?? false,
            params.canUpdate ?? false,
            params.canDelete ?? false,
        );
    }
    // Getters
    get id(): number | null {
        return this._id;
    }
    get roleId(): number {
        return this._roleId;
    }
    get resource(): ResourceName {
        return this._resource;
    }
    get canRead(): boolean {
        return this._canRead;
    }
    get canCreate(): boolean {
        return this._canCreate;
    }
    get canUpdate(): boolean {
        return this._canUpdate;
    }
    get canDelete(): boolean {
        return this._canDelete;
    }

    // Domain
    updatePermissions(flags: {
        canRead?: boolean;
        canCreate?: boolean;
        canUpdate?: boolean;
        canDelete?: boolean;
    }): void {
        if (flags.canRead !== undefined) {
            this._canRead = flags.canRead;
        }
        if (flags.canCreate !== undefined) {
            this._canCreate = flags.canCreate;
        }
        if (flags.canUpdate !== undefined) {
            this._canUpdate = flags.canUpdate;
        }
        if (flags.canDelete !== undefined) {
            this._canDelete = flags.canDelete;
        }
    }
    changeResource(resource: ResourceName): void {
        this._resource = resource;
    }
    hasReadPermission(): boolean {
        return this._canRead;
    }
    hasCreatePermission(): boolean {
        return this._canCreate;
    }
    hasUpdatePermission(): boolean {
        return this._canUpdate;
    }
    hasDeletePermission(): boolean {
        return this._canDelete;
    }
}