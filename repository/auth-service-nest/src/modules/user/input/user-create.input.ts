import { Field, InputType } from '@nestjs/graphql'
import {
    IsArray,
    IsBoolean,
    IsEmail,
    IsEnum,
    IsNotEmpty,
    IsOptional,
    IsString,
    IsUUID,
    Matches,
    MaxLength,
    MinLength,
} from 'class-validator'
import { ERole } from '../../common/enum/role.enum'
import { Type } from 'class-transformer'
import { UUID } from '../../graphql/scalar/uuid.scalar'

@InputType('TUserCreateInput')
export class UserCreateInput {
    @IsEmail()
    @IsNotEmpty()
    @Field(() => String!, {
        description: 'Email of user',
    })
    email: string

    @MinLength(8, {
        message: 'password too short',
    })
    @MaxLength(20, {
        message: 'password too long',
    })
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'password too weak',
    })
    @IsNotEmpty()
    @Field(() => String!, {
        description: 'Password of user',
    })
    password: string

    @Type(() => String)
    @IsNotEmpty()
    @IsString()
    @IsEnum(ERole)
    @Field(() => ERole!, {
        description: 'Role of user',
    })
    role: ERole

    @IsNotEmpty()
    @IsBoolean()
    @Field(() => Boolean!, {
        description: 'Defines are user verified',
    })
    verified: boolean

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    @IsUUID(4, { each: true })
    @Field(() => [String], {
        description: 'Defines user connected external services',
        nullable: true
    })
    externalServicesId?: string[]

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    @IsUUID(4, { each: true })
    @Field(() => [UUID], {
        description: 'Defines user external roles in connected external services',
        nullable: true
    })
    externalRolesId?: string[]
}