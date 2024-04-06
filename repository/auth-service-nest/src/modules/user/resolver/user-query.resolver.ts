import { Args, ObjectType, ResolveField, Resolver } from '@nestjs/graphql'
import { UserAttributes } from '../attributes/user.attributes'
import { UserService } from '../user.service'
import { Inject, UseGuards, UseInterceptors } from '@nestjs/common'
import { UserListAttributes } from '../attributes/user-list.attributes'
import { UserListInput } from '../input/user-list.input'
import { IdInput } from '../../graphql/input/id.input'
import { Roles } from '../../common/decorator/roles.decorator'
import { ERole } from '../../common/enum/role.enum'
import { RoleGraphQLGuard } from '../../common/guard/role-graphql.guard'
import { ActiveGraphQLUser } from '../../common/decorator/active-grahql-user-decorator'
import { JwtGraphQLAuthGuard } from '../../common/guard/jwt-graphql-auth.guard'
import { OperationMetaInterceptor } from '../../graphql/interceptor/operation-meta.interceptor'

@ObjectType('TUserQueries')
export class UserQueries {
}

@UseInterceptors(OperationMetaInterceptor)
@Resolver(() => UserQueries)
export class UserQueryResolver {
    constructor(
        @Inject(UserService)
        private userService: UserService,
    ) {
    }

    @UseGuards(JwtGraphQLAuthGuard, RoleGraphQLGuard)
    @Roles(ERole.Admin, ERole.Moderator)
    @ResolveField(() => UserListAttributes, {
        name: 'list',
        description: 'Provides functionality of getting list of users.',
    })
    async list(
        @Args('input', { nullable: true }) input: UserListInput,
    ) {
        return await this.userService.getAll(input)
    }

    @UseGuards(JwtGraphQLAuthGuard, RoleGraphQLGuard)
    @Roles(ERole.Admin, ERole.Moderator)
    @ResolveField(() => UserAttributes, {
        name: 'record',
        description: 'Provides functionality of getting information about user by id.',
    })
    async record(@Args('idInput') idInput: IdInput) {
        return await this.userService.getOne(idInput.id)
    }

    @UseGuards(JwtGraphQLAuthGuard)
    @ResolveField(() => UserAttributes, {
        name: 'recordMe',
        description: 'Provides user information.',
    })
    async recordMe(@ActiveGraphQLUser('id') userId: string) {
        return this.userService.getOne(userId)
    }
}