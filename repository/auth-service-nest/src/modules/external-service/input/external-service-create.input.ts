import { Field, InputType } from '@nestjs/graphql'
import { IsNotEmpty, IsOptional, IsString } from 'class-validator'

@InputType('TExternalServiceCreateInput')
export class ExternalServiceCreateInput {
    @Field(() => String!, {
        description: 'Name of external service',
    })
    @IsNotEmpty()
    @IsString()
    name: string

    @Field(() => String, {
        description: 'Description of external service',
        nullable: true
    })
    @IsOptional()
    @IsString()
    description?: string

    @Field(() => String!, {
        description: 'Recognition key of external service',
        nullable: true
    })
    @IsNotEmpty()
    @IsString()
    recognitionKey: string
}