import { Type } from '@nestjs/common'
import { Field, ObjectType } from '@nestjs/graphql'
import { ListMetaAttributes } from './list-meta.attributes'
import { DefaultAttributes } from './default.attributes'

export function listAttributesFactory<Entity>(classRef: Type<Entity>) {
    @ObjectType()
    class ListAttributes extends DefaultAttributes {
        @Field(() => [classRef])
        public data: Entity[]

        @Field(() => ListMetaAttributes)
        public meta: ListMetaAttributes
    }

    return ListAttributes
}