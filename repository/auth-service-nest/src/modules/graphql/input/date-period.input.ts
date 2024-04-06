import { IsDateString, IsOptional } from 'class-validator'
import { Field, InputType } from '@nestjs/graphql'

@InputType('TDatePeriodInput')
export class DatePeriodInput {
    @IsDateString()
    @IsOptional()
    @Field(() => Date!, {
        description: 'Start date',
        nullable: true
    })
    startDate: Date

    @IsOptional()
    @IsDateString()
    @Field(() => Date!, {
        description: 'End date',
        nullable: true
    })
    endDate: Date
}