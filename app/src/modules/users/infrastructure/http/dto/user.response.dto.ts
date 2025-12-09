import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
    @ApiProperty({
        description: 'Identificador único del usuario',
        example: 1,
    })
    id!: number;

    @ApiProperty({
        description: 'Nombre de usuario',
        example: 'john123',
    })
    username!: string;

    @ApiProperty({
        description: 'Correo electrónico del usuario',
        example: 'john.doe@example.com',
    })
    email!: string;

    @ApiProperty({
        description: 'ID del rol asignado al usuario',
        example: 2,
    })
    roleId!: number;

    @ApiProperty({
        description: 'Indica si el usuario está activo',
        example: true,
    })
    isActive!: boolean;

    @ApiProperty({
        description: 'Fecha de creación del usuario',
        example: '2025-01-01T12:34:56.000Z',
    })
    createdAt!: Date;
}