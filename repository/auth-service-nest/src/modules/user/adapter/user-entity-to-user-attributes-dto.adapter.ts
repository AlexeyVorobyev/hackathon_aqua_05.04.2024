import { UserEntity } from '../entity/user.entity'
import { Builder } from 'builder-pattern'
import { UserAttributes } from '../attributes/user.attributes'
import {
    externalServiceEntityToExternalServiceAttributesAdapter,
} from '../../external-service/adapter/external-service-entity-to-external-service-attributes.adapter'
import {
    externalRoleEntityToExternalRoleAttributesAdapter,
} from '../../external-role/adapter/external-role-entity-to-external-role-attributes.adapter'

export const userEntityToUserAttributesDtoAdapter = (userEntityInstance: UserEntity): UserAttributes => {
    const userAttributesDtoBuilder = Builder<UserAttributes>()
    userAttributesDtoBuilder
        .id(userEntityInstance.id)
        .email(userEntityInstance.email)
        .role(userEntityInstance.role)
        .updatedAt(new Date(userEntityInstance.updatedAt))
        .createdAt(new Date(userEntityInstance.createdAt))
        .verified(userEntityInstance.verified)
        .externalRoles(
            userEntityInstance.externalRoles
                ?.map((item) => externalRoleEntityToExternalRoleAttributesAdapter(item)) || [],
        )
        .externalServices(
            userEntityInstance.externalServices
                ?.map((item) => externalServiceEntityToExternalServiceAttributesAdapter(item)) || [],
        )
    return userAttributesDtoBuilder.build()
}
