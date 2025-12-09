export class RoleName {
    private constructor(private readonly _value: string) { }
    static create(value: string): RoleName {
        if (!value) {
            throw new Error('Role name is required');
        }
        const trimmed = value.trim();
        
        if (trimmed.length === 0) {
            throw new Error('Role name cannot be empty');
        }
        if (trimmed.length > 50) {
            throw new Error('Role name must be at most 50 characters long');
        }
        const normalized = trimmed.toLowerCase();
        const regex = /^[a-z]+$/;
        
        if (!regex.test(normalized)) {
            throw new Error(
                'Role name must contain only lowercase letters without spaces',
            );
        }
        return new RoleName(normalized);
    }
    
    get value(): string {
        return this._value;
    }
    
    equals(other: RoleName): boolean {
        if (!other) return false;
        return this._value === other._value;
    }
    
    toString(): string {
        return this._value;
    }
}