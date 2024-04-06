import { DefaultDatabaseEntity } from '../../database/entity/default-database.entity'
import { Field, ObjectType } from '@nestjs/graphql'
import { UUID } from '../scalar/uuid.scalar'
import { DefaultAttributes } from './default.attributes'

@ObjectType('TDefaultEntityAttributes')
export abstract class DefaultEntityAttributes extends DefaultAttributes implements DefaultDatabaseEntity<DefaultEntityAttributes> {
    @Field(() => UUID, {
        description: 'Entity id in UUID format',
    })
    id: string

    @Field(() => Date, {
        description: 'Entity creation datetime',
    })
    createdAt: Date

    @Field(() => Date, {
        description: 'Entity last update datetime',
    })
    updatedAt: Date
}
