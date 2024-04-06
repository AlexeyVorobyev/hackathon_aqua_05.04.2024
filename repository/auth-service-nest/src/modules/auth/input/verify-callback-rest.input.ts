import { ApiProperty } from '@nestjs/swagger'

export class VerifyCallbackRestInput {
	@ApiProperty({
		description: 'Verification JWT token',
		required: true,
		type: String,
	})
	token: string

	@ApiProperty({
		description: 'redirect URL if success',
		required: true,
		type: String,
	})
	redirectSuccess: string

	@ApiProperty({
		description: 'redirect URL if failure',
		required: true,
		type: String,
	})
	redirectFailure: string
}