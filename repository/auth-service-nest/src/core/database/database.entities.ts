import { UserEntity } from '../../modules/user/entity/user.entity'
import { ExternalServiceEntity } from '../../modules/external-service/entity/external-service.entity'
import { ExternalRoleEntity } from '../../modules/external-role/entity/external-role.entity'

export const databaseEntities = [
    UserEntity,
    ExternalServiceEntity,
    ExternalRoleEntity
]