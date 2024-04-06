import { Args, ObjectType, ResolveField, Resolver } from '@nestjs/graphql'
import { Inject, UseGuards, UseInterceptors } from '@nestjs/common'
import { ExternalServiceService } from '../external-service.service'
import { Roles } from '../../common/decorator/roles.decorator'
import { JwtGraphQLAuthGuard } from '../../common/guard/jwt-graphql-auth.guard'
import { ERole } from '../../common/enum/role.enum'
import { RoleGraphQLGuard } from '../../common/guard/role-graphql.guard'
import { ExternalServiceAttributes } from '../attributes/external-service.attributes'
import { ExternalServiceCreateInput } from '../input/external-service-create.input'
import { ExternalServiceUpdateInput } from '../input/external-service-update.input'
import { IdInput } from '../../graphql/input/id.input'
import { OperationMetaInterceptor } from '../../graphql/interceptor/operation-meta.interceptor'


@ObjectType('TExternalServiceMutations')
export class ExternalServiceMutations {
}

@UseInterceptors(OperationMetaInterceptor)
@Resolver(() => ExternalServiceMutations)
export class ExternalServiceMutationResolver {
    constructor(
        @Inject(ExternalServiceService)
        private externalServiceService: ExternalServiceService,
    ) {
    }

    @UseGuards(JwtGraphQLAuthGuard, RoleGraphQLGuard)
    @Roles(ERole.Admin, ERole.Moderator)
    @ResolveField(() => ExternalServiceAttributes, {
        name: 'create',
        description: 'Provides functionality of creating external service.',
    })
    async create(
        @Args('input') input: ExternalServiceCreateInput,
    ) {
        return await this.externalServiceService.create(input)
    }

    @UseGuards(JwtGraphQLAuthGuard, RoleGraphQLGuard)
    @Roles(ERole.Admin, ERole.Moderator)
    @ResolveField(() => ExternalServiceAttributes, {
        name: 'update',
        description: 'Provides functionality of editing external service by id.',
    })
    async update(
        @Args('input') input: ExternalServiceUpdateInput,
    ) {
        return await this.externalServiceService.update(input.id, input.payload)
    }

    @UseGuards(JwtGraphQLAuthGuard, RoleGraphQLGuard)
    @Roles(ERole.Admin, ERole.Moderator)
    @ResolveField(() => String, {
        name: 'delete',
        description: 'Provides functionality of deleting external service by id.',
    })
    async delete(
        @Args('input') input: IdInput,
    ) {
        return await this.externalServiceService.delete(input.id)
    }
}