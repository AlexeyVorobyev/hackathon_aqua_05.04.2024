import { IsNotEmpty, IsString } from 'class-validator'
import { Field, InputType } from '@nestjs/graphql'

@InputType('TSignInInput')
export class SignInInput {
    @IsNotEmpty()
    @IsString()
    @Field(() => String!, {
        description: 'Email of user'
    })
    email: string

    @IsNotEmpty()
    @IsString()
    @Field(() => String!, {
        description: 'Password of user',
    })
    password: string
}