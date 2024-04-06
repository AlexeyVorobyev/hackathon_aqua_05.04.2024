import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { TJwtTokenPayload } from '../../jwt/type/jwt-token-payload.type'
import { REQUEST_USER_KEY } from '../constant'
import { GqlExecutionContext } from '@nestjs/graphql'

export const ActiveGraphQLUser = createParamDecorator(
    (field: keyof TJwtTokenPayload | undefined, ctx: ExecutionContext) => {
        const request = GqlExecutionContext.create(ctx).getContext().req
        const user: TJwtTokenPayload | undefined = request[REQUEST_USER_KEY]
        return field ? user?.[field] : user
    }
)