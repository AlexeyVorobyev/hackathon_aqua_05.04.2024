import {FC, useState} from 'react'
import {AlexAutocomplete, IAlexAutocompleteProps} from './alex-autocomplete.component.tsx'
import {Controller, useFormContext} from 'react-hook-form'

interface IAlexAutocompleteControlledProps extends Omit<IAlexAutocompleteProps, 'value' | 'onChange' | 'inputValue' | 'onChangeInputValue'> {
    name: string
    validateFunctions?: {
        [key: string]: (valueToCheck: string) => boolean | string
    }
    required?: boolean
}

export const AlexAutocompleteControlled: FC<IAlexAutocompleteControlledProps> = ({
                                                                                     name,
                                                                                     validateFunctions,
                                                                                     required = false,
                                                                                     ...props
                                                                                 }) => {
    const {control} = useFormContext()

    const [inputValue, onChangeInputValue] = useState<string>()

    const handleChangeInputValue = (event: Event, value: string) => {
        onChangeInputValue(value)
    }

    return (
        <Controller
            name={name}
            control={control}
            rules={{
                validate: {
                    required: required ? (value: string) => value || 'обязательное поле' : () => true,
                    ...validateFunctions,
                },
            }}
            render={({field: {onChange, value}}) => {
                console.debug('ALEX AUTOCOMPLETE VALUE', value)
                return (
                    <AlexAutocomplete value={value} onChange={onChange} {...props}
                                      onChangeInputValue={handleChangeInputValue} inputValue={inputValue}/>
                )
            }}
        />
    )
}