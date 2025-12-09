import { ApiProperty } from '@nestjs/swagger';

export class AuthUserInfoResponseDto {
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
}