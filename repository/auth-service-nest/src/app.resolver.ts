import { Mutation, Query, Resolver } from '@nestjs/graphql'
import { UserQueries } from './modules/user/resolver/user-query.resolver'
import { UserMutations } from './modules/user/resolver/user-mutation.resolver'
import { ExternalServiceQueries } from './modules/external-service/resolver/external-service-query.resolver'
import { ExternalServiceMutations } from './modules/external-service/resolver/external-service-mutation.resolver'
import { ExternalRoleQueries } from './modules/external-role/resolver/external-role-query.resolver'
import { ExternalRoleMutations } from './modules/external-role/resolver/external-role-mutation.resolver'
import { AuthMutations } from './modules/auth/resolver/auth-mutation.resolver'
import { AuthQueries } from './modules/auth/resolver/auth-query.resolver'

@Resolver('root')
export class RootResolver {
    @Query(() => UserQueries, { name: 'user' })
    userQueries() {
        return new UserQueries()
    }

    @Mutation(() => UserMutations, { name: 'user' })
    userMutations() {
        return new UserMutations()
    }

    @Query(() => ExternalServiceQueries, { name: 'externalService' })
    externalServiceQueries() {
        return new ExternalServiceQueries()
    }

    @Mutation(() => ExternalServiceMutations, { name: 'externalService' })
    externalServiceMutations() {
        return new ExternalServiceMutations()
    }

    @Query(() => ExternalRoleQueries, { name: 'externalRole' })
    externalRoleQueries() {
        return new ExternalRoleQueries()
    }

    @Mutation(() => ExternalRoleMutations, { name: 'externalRole' })
    externalRoleMutations() {
        return new ExternalRoleMutations()
    }

    @Mutation(() => AuthMutations, { name: 'auth' })
    authMutations() {
        return new AuthMutations()
    }

    @Query(() => AuthQueries, { name: 'auth' })
    authQueries() {
        return new AuthQueries()
    }
}