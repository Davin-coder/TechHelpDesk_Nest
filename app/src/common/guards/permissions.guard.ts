import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';

import { PERMISSIONS_METADATA_KEY, RequirePermissionsMetadata } from '../decorators/require-permissions.decorator';
import { AuthUser } from '../types/auth-user.interface';
import { CheckPermissionUseCase } from '../../modules/access/application/use-cases/check-permission.use-case';
import { CheckPermissionDto } from '../../modules/access/application/dto/check-permission.dto';

@Injectable()
export class PermissionsGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
        private readonly checkPermissionUseCase: CheckPermissionUseCase,
    ) { }
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const metadata =
            this.reflector.getAllAndOverride<RequirePermissionsMetadata>(
                PERMISSIONS_METADATA_KEY,
                [context.getHandler(), context.getClass()],
            );
        if (!metadata) {
            return true;
        }
        const request = context
            .switchToHttp()
            .getRequest<Request & { user?: AuthUser }>();

        const user = request.user;
        if (!user) {
            throw new UnauthorizedException('User not authenticated');
        }
        if (!user.isActive) {
            throw new ForbiddenException('User is not active');
        }
        const dto: CheckPermissionDto = {
            roleId: user.roleId,
            resource: metadata.resource,
            action: metadata.action,
        };
        const allowed = await this.checkPermissionUseCase.execute(dto);
        if (!allowed) {
            throw new ForbiddenException(
                `User does not have permission "${metadata.action}" on resource "${metadata.resource}"`,
            );
        }
        return true;
    }
}