import { listAttributesFactory } from '../../graphql/attributes/list.attributes'
import { UserAttributes } from './user.attributes'
import { ObjectType, OmitType } from '@nestjs/graphql'
import { ExternalServiceAttributes } from '../../external-service/attributes/external-service.attributes'

@ObjectType('TUserAttributesOmitOperationMeta')
export class UserListAttributesOmitOperationMeta extends OmitType(UserAttributes, ['operationMeta']) {
}
@ObjectType('TUserListAttributes')
export class UserListAttributes extends listAttributesFactory<UserListAttributesOmitOperationMeta>(UserListAttributesOmitOperationMeta) {
}