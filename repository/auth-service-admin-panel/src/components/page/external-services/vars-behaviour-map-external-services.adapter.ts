import {
    ESortDirection,
    TExternalServiceListInput,
    TSortInput,
    TUserListInput,
} from '../../../types/graphql/graphql.ts'

export const varsBehaviourMapExternalServices = (initialVars: any): TExternalServiceListInput => {
    console.log('DEBUG INITIAL_VARS', initialVars)
    let resSort: TSortInput[] = []

    if (initialVars.sort) {
        const sortObj = Object.fromEntries(initialVars.sort)
        for (const key of Object.keys(sortObj)) {
            if (sortObj![key] === 'asc') {
                resSort.push({
                    columnName: key,
                    direction: ESortDirection.ascending,
                })
            } else {
                resSort.push({
                    columnName: key,
                    direction: ESortDirection.descending,
                })
            }
        }
    }

    const mutatedVars: TExternalServiceListInput = {
        ...(initialVars.page && { page: Number(initialVars.page) }),
        ...(initialVars.perPage && { perPage: Number(initialVars.perPage) }),
        ...(initialVars.sort && { sort: resSort }),
        ...(initialVars.simpleFilter && { simpleFilter: initialVars.simpleFilter }),
        ...(initialVars.periodCreate && {
            createDatePeriod: {
                startDate: initialVars.periodCreate.startDate,
                endDate: initialVars.periodCreate.finishDate
            }
        }),
        ...(initialVars.periodUpdate && {
            createDatePeriod: {
                startDate: initialVars.periodUpdate.startDate,
                endDate: initialVars.periodUpdate.finishDate
            }
        })
    }

    console.log('DEBUG MUTATED_VARS', mutatedVars)

    return mutatedVars
}