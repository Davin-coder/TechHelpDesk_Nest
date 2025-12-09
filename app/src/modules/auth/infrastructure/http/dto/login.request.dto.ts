import { ApiProperty } from '@nestjs/swagger';
import {
    IsNotEmpty,
    IsString,
    MinLength,
} from 'class-validator';

export class LoginRequestDto {
    @ApiProperty({
        description:
            'Username o email del usuario para autenticarse',
        example: 'admin@example.com',
    })
    @IsString()
    @IsNotEmpty()
    usernameOrEmail!: string;

    @ApiProperty({
        description: 'Contraseña del usuario',
        example: 'Str0ngP@ssw0rd!',
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    password!: string;
}
