import { IsNotEmpty, IsString, Matches } from 'class-validator'
import { ESortDirection } from '../enum/sort-direction.enum'
import { Field, InputType, ObjectType, registerEnumType } from '@nestjs/graphql'

registerEnumType(ESortDirection, { name: 'ESortDirection' })

@InputType('TSortInput')
export class SortInput {
    @IsString()
    @IsNotEmpty()
    @Field(() => String!, {
        description: 'Name of column',
        nullable: true
    })
    columnName: string
    @IsString()
    @IsNotEmpty()
    @Matches(/^(ASC|DESC)$/g)
    @Field(() => ESortDirection!, {
        description: 'Sort direction',
        nullable: true
    })
    direction: ESortDirection
}