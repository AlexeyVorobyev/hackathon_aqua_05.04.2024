import { ApiProperty } from '@nestjs/swagger'

export class UniversalExceptionDto {
	@ApiProperty({
		type:[String]
	})
	message: string | string[]

	@ApiProperty()
	error: string

	@ApiProperty()
	statusCode: number
}