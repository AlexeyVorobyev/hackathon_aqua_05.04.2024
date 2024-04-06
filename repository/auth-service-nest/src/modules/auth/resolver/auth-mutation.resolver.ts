import { Args, ObjectType, ResolveField, Resolver } from '@nestjs/graphql'
import { Inject, UseGuards, UseInterceptors } from '@nestjs/common'
import { AuthService } from '../auth.serivce'
import { BaseSignUpInput } from '../input/base-sign-up.input'
import { TokenDataAttributes } from '../attributes/token-data.attributes'
import { JwtGraphQLAuthGuard } from '../../common/guard/jwt-graphql-auth.guard'
import { ActiveUser } from '../../common/decorator/active-user.decorator'
import { IdInput } from '../../graphql/input/id.input'
import { RoleGraphQLGuard } from '../../common/guard/role-graphql.guard'
import { Roles } from '../../common/decorator/roles.decorator'
import { ERole } from '../../common/enum/role.enum'
import { ExternalServiceSignUpInput } from '../input/external-service-sign-up.input'
import { DefaultAttributes } from '../../graphql/attributes/default.attributes'
import { OperationMetaInterceptor } from '../../graphql/interceptor/operation-meta.interceptor'

@ObjectType('TAuthMutations')
export class AuthMutations {
}

@UseInterceptors(OperationMetaInterceptor)
@Resolver(() => AuthMutations)
export class AuthMutationResolver {
    constructor(
        private authService: AuthService,
    ) {
    }

    @ResolveField(() => TokenDataAttributes, {
        name: 'baseSignUp',
        description: 'Provides functionality of sign up to system',
    })
    async baseSignUp(@Args('input') input: BaseSignUpInput): Promise<TokenDataAttributes> {
        return this.authService.baseSignUp(input)
    }

    @UseGuards(JwtGraphQLAuthGuard)
    @ResolveField(() => TokenDataAttributes, {
        name: 'externalServiceSignUp',
        description: 'Provides functionality of sign up to particular external service in the system',
    })
    async externalServiceSignUp(
        @Args('input') input: ExternalServiceSignUpInput,
        @ActiveUser('id') userId: string,
    ){
        return this.authService.externalServiceSignUp(input, userId)
    }

    @UseGuards(JwtGraphQLAuthGuard)
    @ResolveField(() => Boolean, {
        name: 'sendConfirmationEmailMe',
        description: 'sends email to you to verify',
    })
    async sendConfirmationMailMe(@ActiveUser('id') userId: string) {
        await this.authService.sendConfirmationMail(userId)
    }

    @UseGuards(JwtGraphQLAuthGuard, RoleGraphQLGuard)
    @Roles(ERole.Admin, ERole.Moderator)
    @ResolveField(() => Boolean, {
        name: 'sendConfirmationEmail',
        description: 'sends email to user to make account verified',
    })
    async sendConfirmationMail(@Args('input') input: IdInput) {
        await this.authService.sendConfirmationMail(input.id)
    }
}
