import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, Matches } from 'class-validator';

export class CreateRoleRequestDto {
    @ApiProperty({
        description:
            'Nombre del rol. Debe estar en minúsculas, sin espacios, solo letras. Máximo 50 caracteres.',
        example: 'admin',
        maxLength: 50,
    })
    @IsString({ message: 'name must be a string' })
    @IsNotEmpty({ message: 'name is required' })
    @MaxLength(50, { message: 'name must be at most 50 characters long' })
    @Matches(/^[a-z]+$/, {
        message:
            'name must contain only lowercase letters without spaces',
    })
    name!: string;
}