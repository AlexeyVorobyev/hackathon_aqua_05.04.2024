import { EUniversalExceptionType } from '../enum/exceptions'

export interface IUniversalError {
	messages: string[]
	exceptionBaseClass: EUniversalExceptionType

	//Provides functionality of throwing exception based on messages and exceptionBaseClass
	throw(): void
}