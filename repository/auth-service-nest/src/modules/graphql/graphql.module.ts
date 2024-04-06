import { Module } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { join } from 'path'
import { UUID } from './scalar/uuid.scalar'
import {
    graphqlFormattedErrorToGraphqlErrorAttributesAdapter
} from './adapter/graphql-formatted-error-to-graphql-error-attributes.adapter'
import { GraphQLFormattedError } from 'graphql/error'

@Module({
    imports: [
        GraphQLModule.forRoot({
            context: ({ req, connection }) => (
                connection
                    ? { req: connection.context }
                    : { req: req }),
            driver: ApolloDriver,
            autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
            resolvers: { UUID: UUID },
            sortSchema: true,
            playground: true,
            cors: {
                credentials: true,
                origin: true,
            },
            fieldResolverEnhancers: ['guards', 'interceptors'],
            formatError: (formattedError) => graphqlFormattedErrorToGraphqlErrorAttributesAdapter(formattedError) as unknown as GraphQLFormattedError
        }),
    ],
})
export class GraphqlModule {
}