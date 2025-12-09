import { ApiProperty } from '@nestjs/swagger';

export class PermissionResponseDto {
    @ApiProperty({
        description: 'Identificador único del permiso',
        example: 10,
    })
    id!: number;

    @ApiProperty({
        description: 'ID del rol al que pertenece este permiso',
        example: 1,
    })
    roleId!: number;

    @ApiProperty({
        description:
            'Nombre del recurso al que aplica este permiso',
        example: 'users',
    })
    resource!: string;

    @ApiProperty({
        description: 'Indica si el rol puede leer este recurso (GET)',
        example: true,
    })
    canRead!: boolean;

    @ApiProperty({
        description: 'Indica si el rol puede crear en este recurso (POST)',
        example: true,
    })
    canCreate!: boolean;

    @ApiProperty({
        description:
            'Indica si el rol puede actualizar este recurso (PUT/PATCH)',
        example: true,
    })
    canUpdate!: boolean;

    @ApiProperty({
        description: 'Indica si el rol puede eliminar en este recurso (DELETE)',
        example: false,
    })
    canDelete!: boolean;
}