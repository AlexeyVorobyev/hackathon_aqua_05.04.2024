import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('TGraphqlErrorAttributes')
export class GraphqlErrorAttributes {
    @Field(() => [String]!,{
        description: 'Error messages list',
    })
    message: string[]

    @Field(() => String!,{
        description: 'Error readable type',
    })
    error: string

    @Field(() => Number!,{
        description: 'Error http code',
    })
    statusCode: number
}
