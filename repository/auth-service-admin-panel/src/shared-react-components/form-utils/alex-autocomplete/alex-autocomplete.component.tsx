import { Autocomplete, Box, FormControl, TextField } from '@mui/material'
import React, { FC, useCallback, useMemo } from 'react'
import { v4 as randomUUID } from 'uuid'

const NOT_FOUND = 'Не найден'

export type TAlexAutocompleteOption = {
    id: string,
    title: string
}

export interface IAlexAutocompleteProps {
    value: string | string[]
    onChange: (...events: any) => void
    multiple?: boolean
    error?: boolean
    errorText?: string
    label?: string
    options: TAlexAutocompleteOption[]
    inputValue?: string
    onChangeInputValue: (...events: any) => void
}

export const AlexAutocomplete: FC<IAlexAutocompleteProps> = ({
                                                                 value,
                                                                 onChange,
                                                                 error,
                                                                 errorText,
                                                                 multiple,
                                                                 label,
                                                                 options,
                                                                 inputValue,
                                                                 onChangeInputValue,
                                                             }) => {
    console.debug(inputValue)

    const handledValue = useMemo(() => {
        if (value === undefined) {
            return multiple
                ? []
                : null
        }
        const findOption = (value: string) => (
            options
                .find((option) => option.id === value)
            || { id: randomUUID(), title: NOT_FOUND }
        )

        if (Array.isArray(value)) {
            return multiple
                ? value.map((item) => findOption(item))
                : findOption(value[0])
        }

        return multiple
            ? [findOption(value)]
            : findOption(value)
    }, [value, options])

    const handleOnChange = useCallback((value: TAlexAutocompleteOption | TAlexAutocompleteOption[] | null) => {
        console.log(value)
        if (Array.isArray(value)) {
            onChange(value.map((item) => item.id))
            return
        }
        if (value) {
            onChange(value.id)
            return
        }
        if (multiple) {
            onChange([])
            return
        }
        onChange(null)
        return null
    }, [onChange])

    return (
        <FormControl fullWidth>
            <Autocomplete
                value={handledValue}
                multiple={multiple}
                onChange={(event, value) => (handleOnChange(value))}
                options={options}
                inputValue={inputValue || ''}
                onInputChange={onChangeInputValue}
                getOptionLabel={(option) => option.title}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label={error && errorText ? `${label}, ${errorText}` : label}
                        error={error}
                    />
                )}
                renderOption={(props, option) => (
                    <Box component="li"
                         sx={{ '& > img': { mr: 2, flexShrink: 0 } }}
                         {...props} key={option.id}>
                        {option.title}
                    </Box>
                )}
            />
        </FormControl>
    )
}