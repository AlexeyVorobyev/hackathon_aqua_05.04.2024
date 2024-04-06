import { SetMetadata } from '@nestjs/common'
import { REQUEST_ROLES_KEY } from '../constant'
import { ERole } from '../enum/role.enum'

export const Roles = (...roles: ERole[]) => SetMetadata(REQUEST_ROLES_KEY, roles)