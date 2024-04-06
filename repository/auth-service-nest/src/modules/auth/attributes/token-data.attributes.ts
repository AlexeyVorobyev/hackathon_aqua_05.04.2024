import { Field, ObjectType } from '@nestjs/graphql'
import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'
import { OperationMetaAttributes } from '../../graphql/attributes/operation-meta.attributes'
import { DefaultAttributes } from '../../graphql/attributes/default.attributes'

@ObjectType('TTokenDataAttributes')
export class TokenDataAttributes extends DefaultAttributes {
    @Field(() => String!, {
        description: 'Access JWT token',
    })
    accessToken: string

    @Field(() => String!, {
        description: 'Timestamp, when access token will expire in UTC',
    })
    accessTokenTTL: number

    @Field(() => String!, {
        description: 'Refresh JWT token',
    })
    refreshToken: string

    @Field(() => String!, {
        description: 'Timestamp, when refresh token will expire in UTC',
    })
    refreshTokenTTL: number
}