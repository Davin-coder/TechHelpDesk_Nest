export class Username {
    private constructor(private readonly _value: string) { }

    static create(value: string): Username {
        if (!value) {
            throw new Error('Username is required');
        }
        const trimmed = value.trim();
        if (trimmed.length < 3) {
            throw new Error('Username must be at least 3 characters long');
        }
        if (trimmed.length > 50) {
            throw new Error('Username must be at most 50 characters long');
        }
        const regex = /^[a-zA-Z0-9]+$/;
        if (!regex.test(trimmed)) {
            throw new Error(
                'Username must be alphanumeric and contain no spaces',
            );
        }
        return new Username(trimmed);
    }
    get value(): string {
        return this._value;
    }
    equals(other: Username): boolean {
        if (!other) return false;
        return this._value === other._value;
    }
    toString(): string {
        return this._value;
    }
}