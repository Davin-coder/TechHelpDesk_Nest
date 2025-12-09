import { registerAs } from '@nestjs/config';

export default registerAs('swagger', () => ({
    title: process.env.SWAGGER_TITLE ?? 'API Documentation',
    description:
        process.env.SWAGGER_DESCRIPTION ?? 'API documentation for the application',
    version: process.env.SWAGGER_VERSION ?? '1.0',
    path: process.env.SWAGGER_PATH ?? 'docs',
}));