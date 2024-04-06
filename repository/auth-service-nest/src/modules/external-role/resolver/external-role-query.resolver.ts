import { Args, ObjectType, ResolveField, Resolver } from '@nestjs/graphql'
import { Inject, UseGuards, UseInterceptors } from '@nestjs/common'
import { IdInput } from '../../graphql/input/id.input'
import { Roles } from '../../common/decorator/roles.decorator'
import { ERole } from '../../common/enum/role.enum'
import { RoleGraphQLGuard } from '../../common/guard/role-graphql.guard'
import { JwtGraphQLAuthGuard } from '../../common/guard/jwt-graphql-auth.guard'
import { ExternalRoleService } from '../external-role.service'
import { ExternalRoleListAttributes } from '../attributes/external-role-list.attributes'
import { ExternalRoleListInput } from '../input/external-role-list.input'
import { ExternalRoleAttributes } from '../attributes/external-role.attributes'
import { OperationMetaInterceptor } from '../../graphql/interceptor/operation-meta.interceptor'

@ObjectType('TExternalRoleQueries')
export class ExternalRoleQueries {
}

@UseInterceptors(OperationMetaInterceptor)
@Resolver(() => ExternalRoleQueries)
export class ExternalRoleQueryResolver {
    constructor(
        @Inject(ExternalRoleService)
        private externalRoleService: ExternalRoleService,
    ) {
    }

    @UseGuards(JwtGraphQLAuthGuard, RoleGraphQLGuard)
    @Roles(ERole.Admin, ERole.Moderator)
    @ResolveField(() => ExternalRoleListAttributes, {
        name: 'list',
        description: 'Provides functionality of getting list of users.',
    })
    async list(
        @Args('input', { nullable: true }) input: ExternalRoleListInput,
    ) {
        return await this.externalRoleService.getAll(input)
    }

    @UseGuards(JwtGraphQLAuthGuard, RoleGraphQLGuard)
    @Roles(ERole.Admin, ERole.Moderator)
    @ResolveField(() => ExternalRoleAttributes, {
        name: 'record',
        description: 'Provides functionality of getting information about user by id.',
    })
    async record(@Args('idInput') idInput: IdInput) {
        return await this.externalRoleService.getOne(idInput.id)
    }
}