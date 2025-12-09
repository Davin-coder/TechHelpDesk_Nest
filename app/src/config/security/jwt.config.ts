import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => {
    const accessTokenSecret = process.env.JWT_SECRET;
    const refreshTokenSecret = process.env.JWT_REFRESH_SECRET;
    if (!accessTokenSecret) {
        throw new Error('JWT_SECRET env var is required');
    }
    if (!refreshTokenSecret) {
        throw new Error('JWT_REFRESH_SECRET env var is required');
    }
    console.log(accessTokenSecret, refreshTokenSecret);
    return {
        accessTokenSecret,
        refreshTokenSecret,
        accessTokenExpiresIn: parseInt(
            process.env.JWT_EXPIRES_IN ?? '900',
            10,
        ),
        refreshTokenExpiresIn: parseInt(
            process.env.JWT_REFRESH_EXPIRES_IN ?? '604800',
            10,
        ),
    };
});
