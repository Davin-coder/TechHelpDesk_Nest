export class ResourceName {
    private constructor(private readonly _value: string) { }

    static create(value: string): ResourceName {
        if (!value) {
            throw new Error('Resource name is required');
        }
        const trimmed = value.trim();
        if (trimmed.length === 0) {
            throw new Error('Resource name cannot be empty');
        }
        if (trimmed.length > 50) {
            throw new Error(
                'Resource name must be at most 50 characters long',
            );
        }
        const normalized = trimmed.toLowerCase();
        const regex = /^[a-z_]+$/;
        if (!regex.test(normalized)) {
            throw new Error(
                'Resource name must contain only lowercase letters and underscores, without spaces',
            );
        }
        return new ResourceName(normalized);
    }
    get value(): string {
        return this._value;
    }
    equals(other: ResourceName): boolean {
        if (!other) return false;
        return this._value === other._value;
    }
    toString(): string {
        return this._value;
    }
}