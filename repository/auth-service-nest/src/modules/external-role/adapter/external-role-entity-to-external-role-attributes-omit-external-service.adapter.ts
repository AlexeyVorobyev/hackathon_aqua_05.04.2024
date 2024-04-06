import { Builder } from 'builder-pattern'
import { ExternalRoleAttributesOmitExternalService } from '../attributes/external-role.attributes'
import { ExternalRoleEntity } from '../entity/external-role.entity'

export const externalRoleEntityToExternalRoleAttributesOmitExternalServiceAdapter = (externalRoleInstance: ExternalRoleEntity): ExternalRoleAttributesOmitExternalService => {
    const externalRoleAttributesOmitExternalServiceBuilder = Builder<ExternalRoleAttributesOmitExternalService>()
    externalRoleAttributesOmitExternalServiceBuilder
        .id(externalRoleInstance.id)
        .description(externalRoleInstance.description)
        .name(externalRoleInstance.name)
        .default(externalRoleInstance.default)
        .createdAt(new Date(externalRoleInstance.createdAt))
        .updatedAt(new Date(externalRoleInstance.updatedAt))
        .recognitionKey(externalRoleInstance.recognitionKey)
    return externalRoleAttributesOmitExternalServiceBuilder.build()
}