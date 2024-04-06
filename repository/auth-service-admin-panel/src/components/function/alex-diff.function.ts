import { diff, updatedDiff } from 'deep-object-diff'

type TValue = Record<string, any>
export const alexDiff = (initialValue: TValue, value: TValue): TValue => {
    const differed:TValue = diff(initialValue, value)
    const arrays:TValue  = {}

    Object.keys(value).forEach((key) => {
        if (Array.isArray(value[key]) && differed[key]) {
            arrays[key] = value[key]
        }
    })

    return {
        ...differed,
        ...arrays
    }
}