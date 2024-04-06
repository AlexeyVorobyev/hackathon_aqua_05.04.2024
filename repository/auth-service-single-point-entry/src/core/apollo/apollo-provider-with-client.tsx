import { FC, ReactNode } from 'react'
import { ApolloClient, ApolloProvider, createHttpLink, InMemoryCache } from '@apollo/client'
import { serverErrorAfterware } from './server-error-afterware.ts'
import { GLOBAL_CONFIG } from '../../globalConfig.ts'

const cache = new InMemoryCache()

const httpLink = createHttpLink({
    uri: GLOBAL_CONFIG.apiAuthServiceAddress
})

const defaultClient = new ApolloClient({
    cache,
    link: serverErrorAfterware.concat(httpLink)
})

interface IApolloProviderWithClientProps {
    children: ReactNode
}

export const ApolloProviderWithClient: FC<IApolloProviderWithClientProps> = ({ children }) => {
    return (
        <ApolloProvider client={defaultClient}>
            {children}
        </ApolloProvider>
    )
}