import { ExternalServiceEntity } from '../entity/external-service.entity'
import { Builder } from 'builder-pattern'
import { ExternalServiceAttributes } from '../attributes/external-service.attributes'
import {
    externalRoleEntityToExternalRoleAttributesOmitExternalServiceAdapter,
} from '../../external-role/adapter/external-role-entity-to-external-role-attributes-omit-external-service.adapter'

export const externalServiceEntityToExternalServiceAttributesAdapter = (externalServiceInstance: ExternalServiceEntity): ExternalServiceAttributes => {
    const externalServiceAttributesBuilder = Builder<ExternalServiceAttributes>()
    externalServiceAttributesBuilder
        .id(externalServiceInstance.id)
        .description(externalServiceInstance.description)
        .name(externalServiceInstance.name)
        .createdAt(new Date(externalServiceInstance.createdAt))
        .updatedAt(new Date(externalServiceInstance.updatedAt))
        .recognitionKey(externalServiceInstance.recognitionKey)
        .externalRoles(externalServiceInstance.externalRoles
            .map((item) => externalRoleEntityToExternalRoleAttributesOmitExternalServiceAdapter(item)))
    return externalServiceAttributesBuilder.build()
}