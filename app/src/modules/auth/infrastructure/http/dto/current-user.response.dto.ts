import { ApiProperty } from '@nestjs/swagger';

export class CurrentUserResponseDto {
    @ApiProperty({ example: 1 })
    id!: number;

    @ApiProperty({ example: 'admin' })
    username!: string;

    @ApiProperty({ example: 'admin@example.com' })
    email!: string;

    @ApiProperty({ example: 1 })
    roleId!: number;

    @ApiProperty({
        example: 'admin',
        required: false,
        nullable: true,
    })
    roleName?: string;

    @ApiProperty({ example: true })
    isActive!: boolean;

    @ApiProperty({
        description: 'Fecha de creación del usuario',
        example: '2025-01-01T12:34:56.000Z',
    })
    createdAt!: Date;
}
