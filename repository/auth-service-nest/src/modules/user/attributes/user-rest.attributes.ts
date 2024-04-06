import { Field } from '@nestjs/graphql'
import { ERole } from '../../common/enum/role.enum'
import { ExternalServiceAttributes } from '../../external-service/attributes/external-service.attributes'
import { ExternalRoleAttributes } from '../../external-role/attributes/external-role.attributes'
import { DefaultEntityRestAttributes } from '../../common/attributes/default-entity-rest.attributes'
import { UserAttributes } from './user.attributes'
import { ApiProperty } from '@nestjs/swagger'
import { ExternalServiceRestAttributes } from '../../external-service/attributes/external-service-rest.attributes'
import { ExternalRoleRestAttributes } from '../../external-role/attributes/external-role-rest.attributes'

export class UserRestAttributes extends DefaultEntityRestAttributes implements UserAttributes {
    @ApiProperty({
        description: 'Email of user',
    })
    email: string

    @ApiProperty({
        description: 'Role of user',
        enum: ERole
    })
    role: ERole

    @ApiProperty({
        description: 'External services of user',
        type: [ExternalServiceRestAttributes]
    })
    externalServices: ExternalServiceRestAttributes[]

    @ApiProperty({
        description: 'External roles of user',
        type: [ExternalRoleRestAttributes]
    })
    externalRoles: ExternalRoleRestAttributes[]

    @ApiProperty({
        description: 'Defines are user verified',
        type: Boolean
    })
    verified: boolean
}