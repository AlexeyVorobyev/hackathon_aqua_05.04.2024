import { Field, InputType } from '@nestjs/graphql'
import { IsArray, IsBoolean, IsEmail, IsNotEmpty, IsOptional, Matches, MaxLength, MinLength } from 'class-validator'
import { ERole } from '../../common/enum/role.enum'
import { Type } from 'class-transformer'

@InputType('TUserUpdateMeInput')
export class UserUpdateMeInput {
	@IsEmail()
	@IsOptional()
	@Field(() => String, {
		description: 'Email of user',
		nullable: true
	})
	email?: string

	@MinLength(8, {
		message: 'password too short'
	})
	@MaxLength(20, {
		message: 'password too long'
	})
	@Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
		message: 'password too weak'
	})
	@IsOptional()
	@Field(() => String, {
		description: 'Password of user',
		nullable: true
	})
	password?: string
}