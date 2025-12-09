import { RoleName } from '../value-objects/role-name.vo';

export class Role {
    private constructor(
        private readonly _id: number | null,
        private _name: RoleName,
    ) {}

    static create(params: { id?: number | null; name: RoleName }): Role {
        const id = params.id ?? null;
        return new Role(id, params.name);
    }
    get id(): number | null {
        return this._id;
    }
    get name(): RoleName {
        return this._name;
    }
    changeName(newName: RoleName): void {
        this._name = newName;
    }
}