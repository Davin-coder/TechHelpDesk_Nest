import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString, MaxLength, Matches } from 'class-validator';

export class ResourcePermissionRequestDto {
    @ApiProperty({
        description:
            'Nombre del recurso. Minúsculas, sin espacios, máximo 50 caracteres. Ej: "users", "roles", "access".',
        example: 'users',
        maxLength: 50,
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
        description: 'Permiso de lectura (GET)',
        example: true,
        required: false,
        default: false,
    })
    @IsOptional()
    @IsBoolean({ message: 'canRead must be a boolean' })
    canRead?: boolean;

    @ApiProperty({
        description: 'Permiso de creación (POST)',
        example: true,
        required: false,
        default: false,
    })
    @IsOptional()
    @IsBoolean({ message: 'canCreate must be a boolean' })
    canCreate?: boolean;

    @ApiProperty({
        description: 'Permiso de actualización (PUT/PATCH)',
        example: true,
        required: false,
        default: false,
    })
    @IsOptional()
    @IsBoolean({ message: 'canUpdate must be a boolean' })
    canUpdate?: boolean;

    @ApiProperty({
        description: 'Permiso de eliminación (DELETE)',
        example: false,
        required: false,
        default: false,
    })
    @IsOptional()
    @IsBoolean({ message: 'canDelete must be a boolean' })
    canDelete?: boolean;
}