import { InMemoryCache } from '@apollo/client'

export const apolloCache = new InMemoryCache({
    typePolicies: {
        User: {
            keyFields: ['user']
        }
    }
})