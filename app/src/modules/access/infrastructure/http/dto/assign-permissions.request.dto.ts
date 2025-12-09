import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsArray, IsInt, Min } from 'class-validator';

import { ResourcePermissionRequestDto } from './resource-permission.request.dto';

export class AssignPermissionsRequestDto {
    @ApiProperty({
        description: 'ID del rol al que se le asignan los permisos',
        example: 1,
    })
    @IsInt({ message: 'roleId must be an integer' })
    @Min(1, { message: 'roleId must be greater than 0' })
    roleId!: number;

    @ApiProperty({
        description:
            'Lista de permisos por recurso que se asignan/actualizan para este rol',
        type: [ResourcePermissionRequestDto],
    })
    @IsArray({ message: 'permissions must be an array' })
    @ArrayMinSize(1, {
        message: 'permissions must contain at least one item',
    })
    permissions!: ResourcePermissionRequestDto[];
}