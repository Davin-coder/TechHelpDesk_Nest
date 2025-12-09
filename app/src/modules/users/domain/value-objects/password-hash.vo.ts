export class PasswordHash {
    private constructor(private readonly _value: string) {}
    static create(value: string): PasswordHash {
        if (!value) {
            throw new Error('Password hash is required');
        }
        const trimmed = value.trim();
        if (trimmed.length === 0) {
            throw new Error('Password hash cannot be empty');
        }
        if (trimmed.length > 255) {
            throw new Error(
                'Password hash must be at most 255 characters long',
            );
        }
        if (trimmed.length < 50) {
            throw new Error('Password hash seems too short');
        }
        return new PasswordHash(trimmed);
    }
    get value(): string {
        return this._value;
    }
    equals(other: PasswordHash): boolean {
        if (!other) return false;
        return this._value === other._value;
    }
    toString(): string {
        return this._value;
    }
}