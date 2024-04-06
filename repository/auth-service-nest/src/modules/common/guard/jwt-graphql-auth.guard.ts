import { CanActivate, ExecutionContext, Inject, Injectable } from '@nestjs/common'
import { Request } from 'express'
import { Builder } from 'builder-pattern'
import { EUniversalExceptionType } from '../enum/exceptions'
import { UniversalError } from '../class/universal-error'
import { REQUEST_USER_KEY } from '../constant'
import { JwtService } from '../../jwt/jwt.service'
import { EJwtStrategy } from '../../jwt/enum/jwt-strategy.enum'
import { GqlExecutionContext } from '@nestjs/graphql'

@Injectable()
export class JwtGraphQLAuthGuard implements CanActivate {
    constructor(
        @Inject(JwtService)
        private readonly jwtAlexService: JwtService,
    ) {
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const ctx = GqlExecutionContext.create(context).getContext().req
        const token = this.getToken(ctx)
        if (!token) {
            Builder(UniversalError)
                .messages(['Authorization token is required'])
                .exceptionBaseClass(EUniversalExceptionType.unauthorized)
                .build().throw()
        }

        ctx[REQUEST_USER_KEY] = await this.jwtAlexService.verifyToken(token, EJwtStrategy.access)

        return true
    }

    private getToken(request: Request) {
        const [_, token] = request.headers.authorization?.split(' ') ?? []
        return token
    }
}