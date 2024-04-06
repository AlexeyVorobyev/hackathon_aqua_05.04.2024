import { EOperationStatus } from '../enum/operation-status.enum'
import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('TOperationMetaAttributes')
export class OperationMetaAttributes {
    @Field(() => Number!, {
        description: 'Operation start timestamp',
    })
    startTimestamp: number

    @Field(() => Number!, {
        description: 'Operation finish timestamp',
    })
    finishTimestamp: number

    @Field(() => Number!, {
        description: 'Operation delta timestamp',
    })
    deltaTimestamp: number
}