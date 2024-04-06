import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
    overwrite: true,
    schema: 'schema.json',
    documents: 'src/**/*.graphql',
    generates: {
        './src/types/graphql/': {
            preset: 'client',
            plugins: [],
            config: {
                namingConvention: 'keep',
                avoidOptionals: {
                    field: true,
                },
                strictScalars: true,
                scalars: {
                    'DateTime': 'string',
                    'UUID': 'string',
                }
            }
        }
    }
}

export default config