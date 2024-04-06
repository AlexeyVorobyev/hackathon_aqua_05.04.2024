import { Field, InputType } from '@nestjs/graphql'
import { ListInput } from '../../graphql/input/list.input'
import { ERole } from '../../common/enum/role.enum'
import { IsArray, IsEnum, IsOptional } from 'class-validator'

@InputType('TUserListInput')
export class UserListInput extends ListInput {
    @IsOptional()
    @IsEnum(ERole)
    @Field(() => ERole, {
        description: 'Filter by user internal role',
        nullable: true
    })
    roleFilter?: ERole

    @IsArray()
    @IsOptional()
    @Field(() => [String], {
        description: 'Filter by external service id. Multiple criteria allowed with OR functionality',
        nullable: true
    })
    externalServiceFilter?: string[]

    @IsArray()
    @IsOptional()
    @Field(() => [String], {
        description: 'Filter by external role id. Multiple criteria allowed with OR functionality',
        nullable: true
    })
    externalRoleFilter?: string[]
}