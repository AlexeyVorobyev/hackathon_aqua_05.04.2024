import { Field, InputType } from '@nestjs/graphql'
import {IsBoolean, IsNotEmpty, IsOptional, IsString, IsUUID} from 'class-validator'
import { UUID } from '../../graphql/scalar/uuid.scalar'

@InputType('TExternalRoleCreateInput')
export class ExternalRoleCreateInput {
    @Field(() => String!, {
        description: 'Name of external role',
    })
    @IsNotEmpty()
    @IsString()
    name: string

    @Field(() => String, {
        description: 'Description of external role',
        nullable: true
    })
    @IsOptional()
    @IsString()
    description?: string

    @Field(() => Boolean, {
        description: 'Is role default',
        nullable: true
    })
    @IsOptional()
    @IsBoolean()
    default?: boolean

    @Field(() => UUID, {
        description: 'Relation with external service',
    })
    @IsNotEmpty()
    @IsUUID(4)
    @IsString()
    externalServiceId: string

    @Field(() => String, {
        description: 'Recognition key of external service',
        nullable: true
    })
    @IsNotEmpty()
    @IsString()
    recognitionKey: string
}