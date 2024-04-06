import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { FORBIDDEN_ERROR_MESSAGE, REQUEST_ROLES_KEY, REQUEST_USER_KEY } from '../constant'
import { ERole } from '../enum/role.enum'
import { TJwtTokenPayload } from '../../jwt/type/jwt-token-payload.type'
import { Builder } from 'builder-pattern'
import { UniversalError } from '../class/universal-error'
import { EUniversalExceptionType } from '../enum/exceptions'

@Injectable()
export class RoleRestGuard implements CanActivate {
	constructor(
		private reflector: Reflector,
	) {
	}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const requiredRoles = this.reflector.getAllAndOverride<ERole[]>(REQUEST_ROLES_KEY, [
			context.getHandler(),
			context.getClass(),
		])
		if (!requiredRoles) {
			return true
		}

		const request = context.switchToHttp().getRequest()
		const userRequestData: TJwtTokenPayload | undefined = request[REQUEST_USER_KEY]

		if (requiredRoles.includes(userRequestData.role)) {
			return true
		}
		else {
			Builder(UniversalError)
				.messages([FORBIDDEN_ERROR_MESSAGE])
				.exceptionBaseClass(EUniversalExceptionType.forbidden)
				.build().throw()
		}
	}
}