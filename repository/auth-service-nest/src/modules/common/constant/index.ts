import { ERole } from '../enum/role.enum'

export const REQUEST_USER_KEY = 'user'
export const REQUEST_ROLES_KEY = 'roles'
export const IS_PUBLIC_KEY = 'isPublic'
export const DEFAULT_ROLE = ERole.User
export const SUPER_USER_ROLE = ERole.Admin
export const FORBIDDEN_ERROR_MESSAGE = 'Your role doesnt provide permission to this action'
export const UNLIMITED_PER_PAGE = 10000000

export const CONFLICT_ERROR_MESSAGE = 'Conflict action'