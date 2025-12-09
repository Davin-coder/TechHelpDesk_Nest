export class UserEmail {
    private constructor(private readonly _value: string) { }

    static create(value: string): UserEmail {
        if (!value) {
            throw new Error('Email is required');
        }
        const trimmed = value.trim().toLowerCase();

        if (trimmed.length === 0) {
            throw new Error('Email cannot be empty');
        }
        if (trimmed.length > 100) {
            throw new Error('Email must be at most 100 characters long');
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(trimmed)) {
            throw new Error('Email format is invalid');
        }
        return new UserEmail(trimmed);
    }
    get value(): string {
        return this._value;
    }
    equals(other: UserEmail): boolean {
        if (!other) return false;
        return this._value === other._value;
    }
    toString(): string {
        return this._value;
    }
}