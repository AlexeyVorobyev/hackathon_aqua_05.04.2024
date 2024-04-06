import { Builder } from 'builder-pattern'
import { ExternalRoleAttributes } from '../attributes/external-role.attributes'
import { ExternalRoleEntity } from '../entity/external-role.entity'
import {
    externalServiceEntityToExternalServiceAttributesAdapter
} from '../../external-service/adapter/external-service-entity-to-external-service-attributes.adapter'
import {
    externalServiceEntityToExternalServiceAttributesOmitExternalRolesAdapter
} from '../../external-service/adapter/external-service-entity-to-external-service-attributes-omit-external-roles.adapter'

export const externalRoleEntityToExternalRoleAttributesAdapter = (externalRoleInstance: ExternalRoleEntity): ExternalRoleAttributes => {
    const externalRoleAttributesBuilder = Builder<ExternalRoleAttributes>()
    externalRoleAttributesBuilder
        .id(externalRoleInstance.id)
        .description(externalRoleInstance.description)
        .name(externalRoleInstance.name)
        .default(externalRoleInstance.default)
        .createdAt(new Date(externalRoleInstance.createdAt))
        .updatedAt(new Date(externalRoleInstance.updatedAt))
        .externalService(externalServiceEntityToExternalServiceAttributesOmitExternalRolesAdapter(externalRoleInstance.externalService))
        .recognitionKey(externalRoleInstance.recognitionKey)
    return externalRoleAttributesBuilder.build()
}