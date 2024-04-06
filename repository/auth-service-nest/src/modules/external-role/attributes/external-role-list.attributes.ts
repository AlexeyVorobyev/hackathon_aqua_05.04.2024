import { listAttributesFactory } from '../../graphql/attributes/list.attributes'
import { ExternalRoleAttributes } from './external-role.attributes'
import { ObjectType, OmitType } from '@nestjs/graphql'

@ObjectType('TExternalRoleAttributesOmitOperationMeta')
export class ExternalRoleAttributesOmitOperationMeta extends OmitType(ExternalRoleAttributes, ['operationMeta']) {
}

@ObjectType('TExternalRoleListAttributes')
export class ExternalRoleListAttributes extends listAttributesFactory<ExternalRoleAttributesOmitOperationMeta>(ExternalRoleAttributesOmitOperationMeta) {
}