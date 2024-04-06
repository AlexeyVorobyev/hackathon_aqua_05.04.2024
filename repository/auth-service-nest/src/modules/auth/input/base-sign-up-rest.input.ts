import { IsEmail, IsNotEmpty, Matches, MaxLength, MinLength } from 'class-validator'
import { Field, InputType } from '@nestjs/graphql'
import { ApiProperty } from '@nestjs/swagger'
import { BaseSignUpInput } from './base-sign-up.input'

export class BaseSignUpRestInput implements BaseSignUpInput {
    @IsEmail()
    @MaxLength(255)
    @IsNotEmpty()
    @ApiProperty({
        example: 'atest@email.com',
        description: 'Email of user'
    })
    email: string

    @MinLength(8, {
        message: 'password too short'
    })
    @MaxLength(20, {
        message: 'password too long'
    })
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'password too weak'
    })
    @IsNotEmpty()
    @ApiProperty({
        description: 'Password of user',
        example: 'Pass#123'
    })
    password: string
}