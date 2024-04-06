import {Inject, Injectable} from '@nestjs/common'
import {ConfigType} from '@nestjs/config'
import jwtConfig from '../config/config/jwt.config'
import {BcryptService} from '../bcrypt/bcrypt.service'
import {Builder} from 'builder-pattern'
import {DEFAULT_ROLE} from '../common/constant'
import {UniversalError} from '../common/class/universal-error'
import {EUniversalExceptionType} from '../common/enum/exceptions'
import {UserService} from '../user/user.service'
import {UserRepository} from '../user/repository/user.repository'
import {EmailService} from '../email/email.service'
import {JwtService} from '../jwt/jwt.service'
import {EJwtStrategy} from '../jwt/enum/jwt-strategy.enum'
import {UserEntity} from '../user/entity/user.entity'
import {UserCreateInput} from '../user/input/user-create.input'
import {BaseSignUpInput} from './input/base-sign-up.input'
import {TokenDataAttributes} from './attributes/token-data.attributes'
import {SignInInput} from './input/sign-in.input'
import {ExternalServiceSignUpInput} from './input/external-service-sign-up.input'
import {ExternalServiceRepository} from '../external-service/repository/external-service.repository'

@Injectable()
export class AuthService {
    constructor(
        @Inject(jwtConfig.KEY)
        private jwtConfiguration: ConfigType<typeof jwtConfig>,
        @Inject(BcryptService)
        private bcryptService: BcryptService,
        @Inject(UserService)
        private userService: UserService,
        @Inject(ExternalServiceRepository)
        private externalServiceRepository: ExternalServiceRepository,
        @Inject(UserRepository)
        private userRepository: UserRepository,
        @Inject(EmailService)
        private emailService: EmailService,
        @Inject(JwtService)
        private jwtAlexService: JwtService,
    ) {
    }

    async baseSignUp(input: BaseSignUpInput): Promise<TokenDataAttributes> {
        const userCreateInput = Builder<UserCreateInput>()
        userCreateInput
            .email(input.email)
            .password(input.password)
            .role(DEFAULT_ROLE)
            .verified(false)
        const createdUserAttributes = await this.userService.create(userCreateInput.build())

        await this.sendConfirmationMail(createdUserAttributes.id)

        const userEntityInstance = await this.userRepository.getOne({ id: createdUserAttributes.id })

        return await this.getTokenDataAttributes(userEntityInstance)
    }

    async externalServiceSignUp(input: ExternalServiceSignUpInput, userId: string): Promise<TokenDataAttributes> {
        const userEntityInstance = await this.userRepository.getOne({ id: userId })

        const userExternalServicesExternalKeys = userEntityInstance.externalServices
            .map((item) => item.recognitionKey)
        if (userExternalServicesExternalKeys.includes(input.recognitionKey)) {
            Builder(UniversalError)
                .messages([
                    'User already signed up to to this external service',
                    `External service recognition key: ${input.recognitionKey}`,
                ])
                .exceptionBaseClass(EUniversalExceptionType.conflict)
                .build().throw()
        }

        const externalServiceToSignUp = await this.externalServiceRepository
            .getOne({ recognitionKey: input.recognitionKey })

        await this.userService.update(
            userId,
            {
                externalServicesId: [
                    ...userEntityInstance.externalServices
                        .map((item) => item.id),
                    externalServiceToSignUp.id,
                ],
                externalRolesId: [
                    ...userEntityInstance.externalRoles
                        .map((item) => item.id),
                    ...externalServiceToSignUp.externalRoles
                        .filter((item) => item.default)
                        .map((item) => item.id),
                ],
            },
        )

        const updatedUserEntityInstance = await this.userRepository.getOne({ id: userEntityInstance.id })

        return await this.getTokenDataAttributes(updatedUserEntityInstance)
    }

    async signIn(input: SignInInput): Promise<TokenDataAttributes> {
        const userEntityInstance = await this.userRepository.getOne({ email: input.email })
        if (!userEntityInstance) {
            Builder(UniversalError)
                .messages(['Invalid email'])
                .exceptionBaseClass(EUniversalExceptionType.badRequest)
                .build().throw()
        }

        const isPasswordMatch = await this.bcryptService.compare(
            input.password,
            userEntityInstance.password,
        )
        if (!isPasswordMatch) {
            Builder(UniversalError)
                .messages(['Invalid password'])
                .exceptionBaseClass(EUniversalExceptionType.badRequest)
                .build().throw()
        }

        return await this.getTokenDataAttributes(userEntityInstance)
    }

    async refresh(token: string): Promise<TokenDataAttributes> {
        const tokenPayload = await this.jwtAlexService.verifyToken(token, EJwtStrategy.refresh)

        const userEntityInstance = await this.userRepository.getOne({ id: tokenPayload.id})
        if (!userEntityInstance) {
            Builder(UniversalError)
                .messages(['Invalid userId'])
                .exceptionBaseClass(EUniversalExceptionType.badRequest)
                .build().throw()
        }

        return await this.getTokenDataAttributes(userEntityInstance)
    }

    private async getTokenDataAttributes(userEntityInstance: UserEntity): Promise<TokenDataAttributes> {
        const TokenDataAttributesBuilder = Builder<TokenDataAttributes>()
        TokenDataAttributesBuilder
            .accessToken(await this.jwtAlexService.generateToken(userEntityInstance, EJwtStrategy.access))
            .accessTokenTTL(Date.parse(new Date().toUTCString()) + this.jwtConfiguration.accessTokenTtl)
            .refreshToken(await this.jwtAlexService.generateToken(userEntityInstance, EJwtStrategy.refresh))
            .refreshTokenTTL(Date.parse(new Date().toUTCString()) + this.jwtConfiguration.refreshTokenTtl)
        return TokenDataAttributesBuilder.build()
    }

    async sendConfirmationMail(userId: string) {
        const userEntityInstance = await this.userRepository.getOne({ id: userId })
        await this.emailService.sendUserConfirmation(
            userEntityInstance,
            await this.jwtAlexService.generateToken(userEntityInstance, EJwtStrategy.verify),
        )
    }

    /**
     * Endpoint for verification user email with provided token.
     * */
    async verifyCallback(res: any, token: string, redirectSuccess: string, redirectFailure: string) {
        console.log(token, redirectSuccess, redirectFailure)
        try {
            const userData = await this.jwtAlexService.verifyToken(token, EJwtStrategy.verify)

            await this.userRepository.update(
                { id: userData.id },
                Builder<UserEntity>()
                    .verified(true)
                    .build(),
            )

            const redirectUrl = new URL(redirectSuccess)
            Array.from(Object.keys(userData)).forEach((key) => {
                redirectUrl.searchParams.append(key, userData[key])
            })
            res.redirect(redirectUrl)
        } catch (e) {
            res.redirect(new URL(redirectFailure))
        }
    }
}