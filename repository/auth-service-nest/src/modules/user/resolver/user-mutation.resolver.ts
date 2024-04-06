import { Args, ObjectType, ResolveField, Resolver } from '@nestjs/graphql'
import { UserAttributes } from '../attributes/user.attributes'
import { UserService } from '../user.service'
import { Inject, UseGuards, UseInterceptors } from '@nestjs/common'
import { IdInput } from '../../graphql/input/id.input'
import { UserCreateInput } from '../input/user-create.input'
import { UserUpdateInput } from '../input/user-update.input'
import { JwtGraphQLAuthGuard } from '../../common/guard/jwt-graphql-auth.guard'
import { Roles } from '../../common/decorator/roles.decorator'
import { ERole } from '../../common/enum/role.enum'
import { RoleGraphQLGuard } from '../../common/guard/role-graphql.guard'
import { ActiveGraphQLUser } from '../../common/decorator/active-grahql-user-decorator'
import { UserUpdateMeInput } from '../input/user-update-me.input'
import { OperationMetaInterceptor } from '../../graphql/interceptor/operation-meta.interceptor'


@ObjectType('TUserMutations')
export class UserMutations {
}

@UseInterceptors(OperationMetaInterceptor)
@Resolver(() => UserMutations)
export class UserMutationResolver {
    constructor(
        @Inject(UserService)
        private userService: UserService,
    ) {
    }

    @UseGuards(JwtGraphQLAuthGuard, RoleGraphQLGuard)
    @Roles(ERole.Admin, ERole.Moderator)
    @ResolveField(() => UserAttributes, {
        name: 'create',
        description: 'Provides functionality of creating users evading sign-up system.',
    })
    async create(
        @Args('input') input: UserCreateInput,
    ) {
        return await this.userService.create(input)
    }

    @UseGuards(JwtGraphQLAuthGuard, RoleGraphQLGuard)
    @Roles(ERole.Admin, ERole.Moderator)
    @ResolveField(() => UserAttributes, {
        name: 'update',
        description: 'Provides functionality of editing user by id.',
    })
    async update(
        @ActiveGraphQLUser('role') role: ERole,
        @Args('input') input: UserUpdateInput,
    ) {
        return await this.userService.update(input.id, input.payload, role)
    }

    @UseGuards(JwtGraphQLAuthGuard, RoleGraphQLGuard)
    @Roles(ERole.Admin, ERole.Moderator)
    @ResolveField(() => String, {
        name: 'delete',
        description: 'Provides functionality of deleting user by id.',
    })
    async delete(
        @ActiveGraphQLUser('role') role: ERole,
        @Args('input') input: IdInput,
    ) {
        return await this.userService.delete(input.id, role)
    }

    @UseGuards(JwtGraphQLAuthGuard)
    @ResolveField(() => UserAttributes, {
        name: 'updateMe',
        description: 'Provides functionality of updating yourself',
    })
    async updateMe(
        @ActiveGraphQLUser('id') userId: string,
        @Args('input') input: UserUpdateMeInput,
    ) {
        return await this.userService.updateMe(userId, input)
    }

    @UseGuards(JwtGraphQLAuthGuard)
    @Roles(ERole.Admin, ERole.Moderator)
    @ResolveField(() => String, {
        name: 'deleteMe',
        description: 'Provides functionality of deleting yourself',
    })
    async deleteMe(
        @ActiveGraphQLUser('id') userId: string,
    ) {
        return await this.userService.deleteMe(userId)
    }
}