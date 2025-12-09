export interface JwtPayloadProps {
    sub: number;
    roleId: number;
    isActive: boolean;
    username?: string;
    email?: string;
    iat?: number;
    exp?: number;
}

export class JwtPayload {
    private constructor(private readonly props: JwtPayloadProps) { }

    static create(props: JwtPayloadProps): JwtPayload {
        if (!props.sub || props.sub <= 0) {
            throw new Error('JwtPayload.sub (user id) must be a positive number');
        }
        if (!props.roleId || props.roleId <= 0) {
            throw new Error('JwtPayload.roleId must be a positive number');
        }
        return new JwtPayload({
            ...props,
            username: props.username?.trim(),
            email: props.email?.trim().toLowerCase(),
        });
    }

    get userId(): number {
        return this.props.sub;
    }
    get roleId(): number {
        return this.props.roleId;
    }
    get isActive(): boolean {
        return this.props.isActive;
    }
    get username(): string | undefined {
        return this.props.username;
    }
    get email(): string | undefined {
        return this.props.email;
    }
    get issuedAt(): number | undefined {
        return this.props.iat;
    }
    get expiresAt(): number | undefined {
        return this.props.exp;
    }

    toPlain(): JwtPayloadProps {
        return { ...this.props };
    }
}