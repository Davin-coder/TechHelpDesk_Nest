import { ApiProperty } from '@nestjs/swagger';

export class RoleResponseDto {
    @ApiProperty({
        description: 'Identificador único del rol',
        example: 1
    })
    id!: number;

    @ApiProperty({
        description: 'Nombre del rol en minúsculas, sin espacios, solo letras',
        example: 'admin'
    })
    name!: string;
}