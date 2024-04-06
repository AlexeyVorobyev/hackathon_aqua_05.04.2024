import { Module } from '@nestjs/common'
import { ExternalRoleService } from './external-role.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ExternalRoleEntity } from './entity/external-role.entity'
import { ExternalRoleRepository } from './repository/external-role.repository'
import { JwtModule } from '../jwt/jwt.module'
import { ExternalRoleQueryResolver } from './resolver/external-role-query.resolver'
import { ExternalRoleMutationResolver } from './resolver/external-role-mutation.resolver'

@Module({
    imports: [
        TypeOrmModule.forFeature([ExternalRoleEntity]),
        JwtModule,
    ],
    providers: [
        ExternalRoleService,
        ExternalRoleRepository,
        ExternalRoleQueryResolver,
        ExternalRoleMutationResolver,
    ],
    exports: [
        ExternalRoleService,
        ExternalRoleRepository,
        ExternalRoleQueryResolver,
        ExternalRoleMutationResolver,
    ],
})
export class ExternalRoleModule {
}