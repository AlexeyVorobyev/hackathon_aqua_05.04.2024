import { Field, InputType } from '@nestjs/graphql'
import { IsJWT, IsNotEmpty, IsString } from 'class-validator'

@InputType('TRefreshInput')
export class RefreshInput {
    @IsNotEmpty()
    @IsString()
    @IsJWT()
    @Field(() => String!, {
        description:'Refresh token'
    })
    token: string
}