import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength, MinLength, Matches } from 'class-validator';

export class ChangePasswordRequestDto {
    @ApiProperty({
        description:
            'Contraseña actual del usuario. Puede requerirse según la lógica de negocio.',
        example: 'OldP@ssw0rd!',
        required: false,
    })
    @IsOptional()
    @IsString({ message: 'currentPassword must be a string' })
    @MinLength(8, {
        message: 'currentPassword must be at least 8 characters long',
    })
    @MaxLength(128, {
        message: 'currentPassword must be at most 128 characters long',
    })
    currentPassword?: string;

    @ApiProperty({
        description:
            'Nueva contraseña. Debe tener mínimo 8 caracteres e incluir mayúsculas, minúsculas, números y símbolos.',
        example: 'N3wStr0ngP@ssword!',
    })
    @IsString({ message: 'newPassword must be a string' })
    @IsNotEmpty({ message: 'newPassword is required' })
    @MinLength(8, {
        message: 'newPassword must be at least 8 characters long',
    })
    @MaxLength(128, {
        message: 'newPassword must be at most 128 characters long',
    })
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/, {
        message:
            'newPassword must contain at least one uppercase letter, one lowercase letter, one number and one special character',
    })
    newPassword!: string;
}