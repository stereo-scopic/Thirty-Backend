import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { ApiCookieAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { Role } from 'src/user/user-role.enum';
import { JwtAuthGuard, PoliciesGuard } from '../guards';

export const Roles = (...roles: Role[]) => {
  return applyDecorators(
    SetMetadata('roles', roles),
    UseGuards(JwtAuthGuard, PoliciesGuard),
    ApiCookieAuth(),
    ApiUnauthorizedResponse({ description: `Unauthorized` }),
  );
};
