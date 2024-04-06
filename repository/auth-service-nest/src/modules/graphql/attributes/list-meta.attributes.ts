import { Field, Int, ObjectType } from '@nestjs/graphql'

@ObjectType('TListMetaAttributes')
export class ListMetaAttributes {
    @Field(() => Int!, {
        description: 'Total amount of elements in list',
    })
    totalElements: number

    @Field(() => Int!, {
        description: 'Total amount of pages in list',
    })
    totalPages: number

    @Field(() => Int!, {
        description: 'Current page',
    })
    currentPage: number

    @Field(() => Int!, {
        description: 'Elements per page',
    })
    elementsPerPage: number
}