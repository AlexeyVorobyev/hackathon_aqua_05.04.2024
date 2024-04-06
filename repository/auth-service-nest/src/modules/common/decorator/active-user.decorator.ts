import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { REQUEST_USER_KEY } from '../constant'
import { TJwtTokenPayload } from '../../jwt/type/jwt-token-payload.type'

export const ActiveUser = createParamDecorator(
	(field: keyof TJwtTokenPayload | undefined, ctx: ExecutionContext) => {
		const request = ctx.switchToHttp().getRequest()
		const user: TJwtTokenPayload | undefined = request[REQUEST_USER_KEY]
		return field ? user?.[field] : user
	}
)