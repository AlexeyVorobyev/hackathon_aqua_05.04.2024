import { Field, InputType } from '@nestjs/graphql'
import { IsString } from 'class-validator'

@InputType('TExternalServiceSignUpInput')
export class ExternalServiceSignUpInput {
    @IsString()
    @Field(() => String!, {
        description: 'Special key to recognise external service'
    })
    recognitionKey: string
}