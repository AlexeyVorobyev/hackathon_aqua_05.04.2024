import { IUniversalError } from '../interface/universal-error.interface'
import { EUniversalExceptionType } from '../enum/exceptions'
import {
	BadGatewayException,
	BadRequestException,
	ConflictException,
	ForbiddenException, InternalServerErrorException,
	UnauthorizedException
} from '@nestjs/common'

export class UniversalError implements IUniversalError {
	messages: string[]
	exceptionBaseClass: EUniversalExceptionType

	constructor(
		messages: string[],
		exceptionBaseClass: EUniversalExceptionType
	) {
		this.messages = messages
		this.exceptionBaseClass = exceptionBaseClass
	}

	public throw() {
		switch (this.exceptionBaseClass) {
			case EUniversalExceptionType.unauthorized:
				throw new UnauthorizedException(this.messages)
			case EUniversalExceptionType.forbidden:
				throw new ForbiddenException(this.messages)
			case EUniversalExceptionType.badRequest:
				throw new BadRequestException(this.messages)
			case EUniversalExceptionType.badGateway:
				throw new BadGatewayException(this.messages)
			case EUniversalExceptionType.conflict:
				throw new ConflictException(this.messages)
			case EUniversalExceptionType.server:
			default:
				throw new InternalServerErrorException(this.messages)
		}
	}

}
