import { Args, ObjectType, ResolveField, Resolver } from '@nestjs/graphql'
import { Inject, UseInterceptors } from '@nestjs/common'
import { AuthService } from '../auth.serivce'
import { TokenDataAttributes } from '../attributes/token-data.attributes'
import { SignInInput } from '../input/sign-in.input'
import { RefreshInput } from '../input/refresh.input'
import { ActiveUser } from '../../common/decorator/active-user.decorator'
import { OperationMetaInterceptor } from '../../graphql/interceptor/operation-meta.interceptor'

@ObjectType('TAuthQueries')
export class AuthQueries {
}

@UseInterceptors(OperationMetaInterceptor)
@Resolver(() => AuthQueries)
export class AuthQueryResolver {
    constructor(
        private authService: AuthService,
    ) {
    }

    @ResolveField(() => TokenDataAttributes, {
        name: 'signIn',
        description: 'Provides functionality of sign in to system.',
    })
    async signIn(@Args('input') input: SignInInput): Promise<TokenDataAttributes> {
        return this.authService.signIn(input)
    }

    @ResolveField(() => TokenDataAttributes, {
        name: 'refresh',
        description: 'Provides functionality of refreshing tokens.',
    })
    async refresh(
        @Args('input') input: RefreshInput,
    ): Promise<TokenDataAttributes> {
        return this.authService.refresh(input.token)
    }
}