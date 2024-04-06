import { Module } from '@nestjs/common'
import { ExternalServiceService } from './external-service.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ExternalServiceEntity } from './entity/external-service.entity'
import { ExternalServiceRepository } from './repository/external-service.repository'
import { ExternalServiceQueryResolver } from './resolver/external-service-query.resolver'
import { JwtModule } from '../jwt/jwt.module'
import { ExternalServiceMutationResolver } from './resolver/external-service-mutation.resolver'

@Module({
    imports: [
        TypeOrmModule.forFeature([ExternalServiceEntity]),
        JwtModule,
    ],
    providers: [
        ExternalServiceService,
        ExternalServiceRepository,
        ExternalServiceQueryResolver,
        ExternalServiceMutationResolver,
    ],
    exports: [
        ExternalServiceService,
        ExternalServiceRepository,
        ExternalServiceQueryResolver,
        ExternalServiceMutationResolver,
    ],
})
export class ExternalServiceModule {
}