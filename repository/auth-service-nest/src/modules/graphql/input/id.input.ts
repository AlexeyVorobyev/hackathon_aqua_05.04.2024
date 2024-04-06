import { IsNotEmpty, IsUUID } from 'class-validator'
import { Type } from 'class-transformer'
import { Field, InputType } from '@nestjs/graphql'
import { UUID } from '../scalar/uuid.scalar'

@InputType('TIdInput')
export class IdInput {
    @IsUUID(4)
    @IsNotEmpty()
    @Type(() => String)
    @Field(() => UUID!, {
        description: 'Identification property with uuid signature',
    })
    id: string
}