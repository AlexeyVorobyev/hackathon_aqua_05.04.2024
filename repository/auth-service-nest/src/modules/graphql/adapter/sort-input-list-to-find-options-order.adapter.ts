import { FindOptionsOrder } from 'typeorm'
import { SortInput } from '../input/sort.input'

export const sortInputListToFindOptionsOrderAdapter = <Entity extends Object>(input: SortInput[], entity: Entity): FindOptionsOrder<Entity> => {
    return Object.fromEntries(
        input
            .filter((sortDtoInstance) => entity.hasOwnProperty(sortDtoInstance.columnName))
            .map((sortDtoInstance) => {
                return [
                    sortDtoInstance.columnName,
                    sortDtoInstance.direction,
                ]
            }),
    ) as FindOptionsOrder<Entity>
}