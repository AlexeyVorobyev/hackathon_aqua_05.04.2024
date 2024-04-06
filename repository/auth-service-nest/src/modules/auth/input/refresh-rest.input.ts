import { ApiProperty } from '@nestjs/swagger'
import { IsJWT, IsNotEmpty, IsString } from 'class-validator'
import { RefreshInput } from './refresh.input'


export class RefreshRestInput implements RefreshInput {
	@IsNotEmpty()
	@IsString()
	@IsJWT()
	@ApiProperty({
		description: 'Refresh Token',
		example: 'token'
	})
	token: string
}