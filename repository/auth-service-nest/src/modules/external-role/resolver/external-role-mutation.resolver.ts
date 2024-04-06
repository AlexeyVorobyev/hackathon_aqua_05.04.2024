import { Args, ObjectType, ResolveField, Resolver } from '@nestjs/graphql'
import { Inject, UseGuards, UseInterceptors } from '@nestjs/common'
import { IdInput } from '../../graphql/input/id.input'
import { JwtGraphQLAuthGuard } from '../../common/guard/jwt-graphql-auth.guard'
import { Roles } from '../../common/decorator/roles.decorator'
import { ERole } from '../../common/enum/role.enum'
import { RoleGraphQLGuard } from '../../common/guard/role-graphql.guard'
import { ExternalRoleService } from '../external-role.service'
import { ExternalRoleAttributes } from '../attributes/external-role.attributes'
import { ExternalRoleCreateInput } from '../input/external-role-create.input'
import { ExternalRoleUpdateInput } from '../input/external-role-update.input'
import { OperationMetaInterceptor } from '../../graphql/interceptor/operation-meta.interceptor'


@ObjectType('TExternalRoleMutations')
export class ExternalRoleMutations {
}

@UseInterceptors(OperationMetaInterceptor)
@Resolver(() => ExternalRoleMutations)
export class ExternalRoleMutationResolver {
    constructor(
        @Inject(ExternalRoleService)
        private externalRoleService: ExternalRoleService,
    ) {
    }

    @UseGuards(JwtGraphQLAuthGuard, RoleGraphQLGuard)
    @Roles(ERole.Admin, ERole.Moderator)
    @ResolveField(() => ExternalRoleAttributes, {
        name: 'create',
        description: 'Provides functionality of creating users evading sign-up system.',
    })
    async create(
        @Args('input') input: ExternalRoleCreateInput,
    ) {
        return await this.externalRoleService.create(input)
    }

    @UseGuards(JwtGraphQLAuthGuard, RoleGraphQLGuard)
    @Roles(ERole.Admin, ERole.Moderator)
    @ResolveField(() => ExternalRoleAttributes, {
        name: 'update',
        description: 'Provides functionality of editing external role by id.',
    })
    async update(
        @Args('input') input: ExternalRoleUpdateInput,
    ) {
        return await this.externalRoleService.update(input.id, input.payload)
    }

    @UseGuards(JwtGraphQLAuthGuard, RoleGraphQLGuard)
    @Roles(ERole.Admin, ERole.Moderator)
    @ResolveField(() => String, {
        name: 'delete',
        description: 'Provides functionality of deleting external role by id.',
    })
    async delete(
        @Args('input') input: IdInput,
    ) {
        return await this.externalRoleService.delete(input.id)
    }
}