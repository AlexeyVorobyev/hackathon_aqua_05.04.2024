import { Inject } from '@nestjs/common'
import { JwtService as JwtNestService } from '@nestjs/jwt'
import { randomUUID } from 'crypto'
import { Builder } from 'builder-pattern'
import { EJwtStrategy } from './enum/jwt-strategy.enum'
import { TJwtTokenPayload } from './type/jwt-token-payload.type'
import { UniversalError } from '../common/class/universal-error'
import { EUniversalExceptionType } from '../common/enum/exceptions'
import { UserEntity } from '../user/entity/user.entity'

export class JwtService {
    constructor(
        @Inject('JwtAccessService')
        private readonly jwtAccessService: JwtNestService,
        @Inject('JwtRefreshService')
        private readonly jwtRefreshService: JwtNestService,
        @Inject('JwtVerifyService')
        private readonly jwtVerifyService: JwtNestService,
    ) {
    }

    async verifyToken(
        jwtToken: string,
        strategy: EJwtStrategy,
    ): Promise<TJwtTokenPayload> {
        try {
            switch (strategy) {
                case EJwtStrategy.access:
                    return await this.jwtAccessService.verifyAsync<TJwtTokenPayload>(jwtToken)
                case EJwtStrategy.refresh:
                    return await this.jwtRefreshService.verifyAsync<TJwtTokenPayload>(jwtToken)
                case EJwtStrategy.verify:
                    return await this.jwtVerifyService.verifyAsync<TJwtTokenPayload>(jwtToken)
            }
        } catch (error) {
            Builder(UniversalError)
                .messages([error.message])
                .exceptionBaseClass(EUniversalExceptionType.badRequest)
                .build().throw()
        }
    }

    async generateToken(
        user: UserEntity,
        strategy: EJwtStrategy,
    ): Promise<string> {
        const jwtTokenPayload: TJwtTokenPayload = {
            id: user.id,
            email: user.email,
            role: user.role,
            tokenId: randomUUID(),
            services: user.externalServices.map((service) => ({
                id: service.id,
                name: service.name,
                recognitionKey: service.recognitionKey,
                roles: user.externalRoles
                    .filter((role) => service.externalRoles
                        .map((item) => item.id).includes(role.id))
                    .map((role) => ({
                        id: role.id,
                        name: role.name,
                        recognitionKey: role.recognitionKey,
                    })),
            })),
        }

        switch (strategy) {
            case EJwtStrategy.access:
                return await this.jwtAccessService.signAsync(jwtTokenPayload)
            case EJwtStrategy.refresh:
                return await this.jwtRefreshService.signAsync(jwtTokenPayload)
            case EJwtStrategy.verify:
                return await this.jwtVerifyService.signAsync(jwtTokenPayload)
        }
    }
}