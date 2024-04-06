import { IsNotEmpty, IsString } from 'class-validator'
import { Field, InputType } from '@nestjs/graphql'
import { ApiProperty } from '@nestjs/swagger'
import { SignInInput } from './sign-in.input'

export class SignInRestInput implements SignInInput {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        description: 'Email of user',
        example: 'atest@email.com'
    })
    email: string

    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        description: 'Password of user',
        example: 'Pass#123'
    })
    password: string
}