import { IsNumber, IsOptional, IsPositive, IsString, IsUUID, Min, ValidateNested } from 'class-validator'
import { Transform, Type } from 'class-transformer'
import { Field, InputType, Int } from '@nestjs/graphql'
import { DatePeriodInput } from './date-period.input'
import { SortInput } from './sort.input'
import { UUID } from '../scalar/uuid.scalar'
import validator from 'validator'

@InputType()
export abstract class ListInput {
    @Min(0)
    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    @Field(() => Int, {
        description: 'Page of list',
        nullable: true,
    })
    page?: number = 0

    @IsPositive()
    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    @Field(() => Int, {
        description: 'Amount of elements per page',
        nullable: true,
    })
    perPage?: number = 8

    @IsString()
    @IsOptional()
    @Field(() => String, {
        description: 'SimpleFilter',
        nullable: true,
    })
    @Transform((value) => validator.trim(value.value))
    @Transform((value) => value.value.toLowerCase())
    simpleFilter?: string

    @IsOptional()
    @IsUUID(4, { each: true })
    @IsString({ each: true })
    @Field(() => [UUID], {
        description: 'Filter by entity id. Multiple criteria allowed with OR functionality',
        nullable: true,
    })
    id?: string[]

    @IsOptional()
    @ValidateNested()
    @Field(() => DatePeriodInput, {
        description: 'Datetime period criteria',
        name: 'createDatePeriod',
        nullable: true,
    })
    createDatePeriod?: DatePeriodInput

    @IsOptional()
    @ValidateNested()
    @Field(() => DatePeriodInput, {
        description: 'Datetime period criteria',
        name: 'updateDatePeriod',
        nullable: true,
    })
    updateDatePeriod?: DatePeriodInput

    @IsOptional()
    @ValidateNested({ each: true })
    @Field(() => [SortInput], {
        description: 'Sorting criteria',
        nullable: true,
    })
    sort?: SortInput[] = []
}