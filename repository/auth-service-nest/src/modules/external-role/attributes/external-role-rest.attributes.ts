import { DefaultEntityRestAttributes } from '../../common/attributes/default-entity-rest.attributes'
import { ExternalRoleAttributes } from './external-role.attributes'
import { ApiProperty } from '@nestjs/swagger'
import {
    ExternalServiceRestAttributesOmitExternalService,
} from '../../external-service/attributes/external-service-rest.attributes'

export class ExternalRoleRestAttributes extends DefaultEntityRestAttributes implements ExternalRoleAttributes {
    @ApiProperty({
        description: 'Name of external role',
    })
    name: string

    @ApiProperty({
        description: 'Description of external role',
        nullable: true,
    })
    description?: string

    @ApiProperty({
        description: 'Is role default',
        type: Boolean,
    })
    default: boolean

    @ApiProperty({
        description: 'Recognition key of external role',
        nullable: true,
    })
    recognitionKey: string

    @ApiProperty({
        description: 'External service attributes',
        type: () => ExternalServiceRestAttributesOmitExternalService,
    })
    externalService: ExternalServiceRestAttributesOmitExternalService
}

export class ExternalRoleRestAttributesOmitExternalService
    extends DefaultEntityRestAttributes
    implements Omit<ExternalRoleRestAttributes, 'externalService'> {
    @ApiProperty({
        description: 'Name of external role',
    })
    name: string

    @ApiProperty({
        description: 'Description of external role',
        nullable: true,
    })
    description?: string

    @ApiProperty({
        description: 'Is role default',
        type: Boolean,
    })
    default: boolean

    @ApiProperty({
        description: 'Recognition key of external role',
        nullable: true,
    })
    recognitionKey: string
}