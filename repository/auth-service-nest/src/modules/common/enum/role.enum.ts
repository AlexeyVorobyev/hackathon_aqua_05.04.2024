import { registerEnumType } from '@nestjs/graphql'

export enum ERole {
	User = 'user',
	Admin = 'admin',
	Moderator = 'moderator'
}

registerEnumType(ERole, { name: 'ERole' })

