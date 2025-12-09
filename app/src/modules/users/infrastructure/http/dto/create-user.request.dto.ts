import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsString
    , Matches, MaxLength, MinLength, IsInt, Min } from 'class-validator';

export class CreateUserRequestDto {
    @ApiProperty({
        description:
            'Nombre de usuario. Debe ser alfanumérico, sin espacios, entre 3 y 50 caracteres.',
        example: 'john123',
        minLength: 3,
        maxLength: 50,
    })
    @IsString({ message: 'username must be a string' })
    @IsNotEmpty({ message: 'username is required' })
    @MinLength(3, {
        message: 'username must be at least 3 characters long',
    })
    @MaxLength(50, {
        message: 'username must be at most 50 characters long',
    })
    @Matches(/^[a-zA-Z0-9]+$/, {
        message: 'username must be alphanumeric and contain no spaces',
    })
    username!: string;

    @ApiProperty({
        description: 'Correo electrónico del usuario',
        example: 'john.doe@example.com',
        maxLength: 100,
    })
    @IsEmail({}, { message: 'email must be a valid email address' })
    @MaxLength(100, {
        message: 'email must be at most 100 characters long',
    })
    email!: string;

    @ApiProperty({
        description:
            'Contraseña del usuario. Debe tener mínimo 8 caracteres, incluir mayúsculas, minúsculas, números y símbolos.',
        example: 'Str0ngP@ssword!',
        minLength: 8,
    })
    @IsString({ message: 'password must be a string' })
    @IsNotEmpty({ message: 'password is required' })
    @MinLength(8, {
        message: 'password must be at least 8 characters long',
    })
    @MaxLength(128, {
        message: 'password must be at most 128 characters long',
    })
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/, {
        message:
            'password must contain at least one uppercase letter, one lowercase letter, one number and one special character',
    })
    password!: string;

    @ApiProperty({
        description: 'ID del rol asignado al usuario',
        example: 2,
    })
    @IsInt({ message: 'roleId must be an integer' })
    @Min(1, { message: 'roleId must be greater than 0' })
    roleId!: number;

    @ApiProperty({
        description:
            'Indica si el usuario está activo (puede autenticarse). Por defecto true.',
        example: true,
        required: false,
        default: true,
    })
    @IsOptional()
    @IsBoolean({ message: 'isActive must be a boolean value' })
    isActive?: boolean;
}