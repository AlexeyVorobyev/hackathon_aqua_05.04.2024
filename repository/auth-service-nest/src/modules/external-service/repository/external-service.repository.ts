import {
    AbstractTypeormRepositoryFactory,
    Constructor,
} from '../../database/factory/abstract-typeorm-repository.factory'
import { ExternalServiceEntity } from '../entity/external-service.entity'

export class ExternalServiceRepository extends AbstractTypeormRepositoryFactory<ExternalServiceEntity>(ExternalServiceEntity as Constructor<ExternalServiceEntity>) {
}