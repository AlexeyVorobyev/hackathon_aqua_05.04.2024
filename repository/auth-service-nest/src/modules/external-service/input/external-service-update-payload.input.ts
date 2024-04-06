import { Field, InputType } from '@nestjs/graphql'
import { IsNotEmpty, IsOptional, IsString } from 'class-validator'

@InputType('TExternalServiceUpdatePayloadInput')
export class ExternalServiceUpdatePayloadInput {
    @Field(() => String, {
        description: 'Name of external service',
        nullable: true
    })
    @IsOptional()
    @IsString()
    name?: string

    @Field(() => String, {
        description: 'Description of external service',
        nullable: true
    })
    @IsOptional()
    @IsString()
    description?: string

    @Field(() => String, {
        description: 'Recognition key of external service',
        nullable: true
    })
    @IsOptional()
    @IsString()
    recognitionKey?: string
}