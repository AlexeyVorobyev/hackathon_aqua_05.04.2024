import { listAttributesFactory } from '../../graphql/attributes/list.attributes'
import { ExternalServiceAttributes } from './external-service.attributes'
import { ObjectType, OmitType } from '@nestjs/graphql'

@ObjectType('TExternalServiceAttributesOmitOperationMeta')
export class ExternalServiceListAttributesOmitOperationMeta extends OmitType(ExternalServiceAttributes, ['operationMeta']) {
}

@ObjectType('TExternalServiceListAttributes')
export class ExternalServiceListAttributes extends listAttributesFactory<ExternalServiceListAttributesOmitOperationMeta>(ExternalServiceListAttributesOmitOperationMeta) {
}