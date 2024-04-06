import { InputType } from '@nestjs/graphql'
import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'
import { ExternalServiceSignUpInput } from './external-service-sign-up.input'

@InputType('TExternalServiceSignUpInput')
export class ExternalServiceSignUpRestInput implements ExternalServiceSignUpInput {
    @IsString()
    @ApiProperty({
        description: 'Special key to recognise external service',
    })
    recognitionKey: string
}