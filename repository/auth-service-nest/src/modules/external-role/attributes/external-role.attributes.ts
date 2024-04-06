import { DefaultEntityAttributes } from '../../graphql/attributes/default-entity.attributes'
import { Field, ObjectType, OmitType } from '@nestjs/graphql'
import {
    ExternalServiceAttributes,
    ExternalServiceAttributesOmitExternalRoles,
} from '../../external-service/attributes/external-service.attributes'

@ObjectType('TExternalRoleAttributes')
export class ExternalRoleAttributes extends DefaultEntityAttributes {
    @Field(() => String!, {
        description: 'Name of external role',
    })
    name: string

    @Field(() => String, {
        description: 'Description of external role',
        nullable: true
    })
    description?: string

    @Field(() => Boolean, {
        description: 'Is role default',
    })
    default: boolean

    @Field(() => String!, {
        description: 'Recognition key of external role',
        nullable: true
    })
    recognitionKey: string

    @Field(() => ExternalServiceAttributesOmitExternalRoles, {
        description: 'External service attributes'
    })
    externalService: ExternalServiceAttributesOmitExternalRoles
}

@ObjectType('TExternalRoleAttributesOmitExternalService')
export class ExternalRoleAttributesOmitExternalService extends OmitType(ExternalRoleAttributes, ['externalService']) {
}