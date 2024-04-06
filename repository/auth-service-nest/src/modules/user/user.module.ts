import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserEntity } from './entity/user.entity'
import { UserService } from './user.service'
import { ExternalRoleModule } from '../external-role/external-role.module'
import { BcryptModule } from '../bcrypt/bcrypt.module'
import { UserRepository } from './repository/user.repository'
import { UserQueryResolver } from './resolver/user-query.resolver'
import { JwtModule } from '../jwt/jwt.module'
import { UserMutationResolver } from './resolver/user-mutation.resolver'
import { ExternalServiceModule } from '../external-service/external-service.module'
import { UserController } from './user.controller'

@Module({
    imports: [
        TypeOrmModule.forFeature([UserEntity]),
        ExternalRoleModule,
        BcryptModule,
        ExternalServiceModule,
        JwtModule,
    ],
    providers: [
        UserService,
        UserRepository,
        UserQueryResolver,
        UserMutationResolver,
    ],
    controllers: [UserController],
    exports: [
        UserService,
        UserRepository,
        UserQueryResolver,
        UserMutationResolver,
    ],
})
export class UserModule {
}