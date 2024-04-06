import {
    AbstractTypeormRepositoryFactory,
    Constructor,
} from '../../database/factory/abstract-typeorm-repository.factory'
import { ExternalRoleEntity } from '../entity/external-role.entity'

export class ExternalRoleRepository extends AbstractTypeormRepositoryFactory<ExternalRoleEntity>(ExternalRoleEntity as Constructor<ExternalRoleEntity>) {
}