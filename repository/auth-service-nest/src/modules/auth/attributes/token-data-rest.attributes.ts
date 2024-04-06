import { ApiProperty } from '@nestjs/swagger'
import { TokenDataAttributes } from './token-data.attributes'
import { OperationMetaAttributes } from '../../graphql/attributes/operation-meta.attributes'

export class TokenDataRestAttributes implements Omit<TokenDataAttributes, 'operationMeta'> {
    @ApiProperty({
        description: 'Access JWT token',
    })
    accessToken: string

    @ApiProperty({
        description: 'Date, when access token will expire',
    })
    accessTokenTTL: number

    @ApiProperty({
        description: 'Refresh JWT token',
    })
    refreshToken: string

    @ApiProperty({
        description: 'Date, when refresh token will expire',
    })
    refreshTokenTTL: number
}