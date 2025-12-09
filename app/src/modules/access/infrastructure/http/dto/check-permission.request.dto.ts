import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsInt, IsNotEmpty, IsString, MaxLength, Matches, Min } from 'class-validator';

export class CheckPermissionRequestDto {
    @ApiProperty({
        description: 'ID del rol a verificar',
        example: 1,
    })
    @IsInt({ message: 'roleId must be an integer' })
    @Min(1, { message: 'roleId must be greater than 0' })
    roleId!: number;

    @ApiProperty({
        description:
            'Nombre del recurso. Minúsculas, sin espacios, máximo 50 caracteres.',
        example: 'users',
    })
    @IsString({ message: 'resource must be a string' })
    @IsNotEmpty({ message: 'resource is required' })
    @MaxLength(50, {
        message: 'resource must be at most 50 characters long',
    })
    @Matches(/^[a-z_]+$/, {
        message:
            'resource must contain only lowercase letters and underscores, without spaces',
    })
    resource!: string;

    @ApiProperty({
        description:
            'Acción a verificar: read (GET), create (POST), update (PUT/PATCH), delete (DELETE)',
        example: 'read',
        enum: ['read', 'create', 'update', 'delete'],
    })
    @IsString({ message: 'action must be a string' })
    @IsIn(['read', 'create', 'update', 'delete'], {
        message:
            'action must be one of: read, create, update, delete',
    })
    action!: string;
}