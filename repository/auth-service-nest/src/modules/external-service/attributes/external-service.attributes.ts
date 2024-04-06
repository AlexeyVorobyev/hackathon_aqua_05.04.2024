import { DefaultEntityAttributes } from '../../graphql/attributes/default-entity.attributes'
import { Field, ObjectType, OmitType } from '@nestjs/graphql'
import {
    ExternalRoleAttributes,
    ExternalRoleAttributesOmitExternalService,
} from '../../external-role/attributes/external-role.attributes'

@ObjectType('TExternalServiceAttributes')
export class ExternalServiceAttributes extends DefaultEntityAttributes {
    @Field(() => String!, {
        description: 'Name of external service',
    })
    name: string

    @Field(() => String, {
        description: 'Description of external service',
        nullable: true
    })
    description?: string

    @Field(() => String!, {
        description: 'Recognition key of external service',
    })
    recognitionKey: string

    @Field(() => [ExternalRoleAttributesOmitExternalService]!, {
        description: 'External role attributes',
    })
    externalRoles: ExternalRoleAttributesOmitExternalService[]
}

@ObjectType('TExternalServiceAttributesOmitExternalRoles')
export class ExternalServiceAttributesOmitExternalRoles extends OmitType(ExternalServiceAttributes, ['externalRoles']) {
}