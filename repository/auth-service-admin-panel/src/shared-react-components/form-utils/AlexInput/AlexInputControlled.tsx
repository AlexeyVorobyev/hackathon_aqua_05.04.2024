import React, { FC } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { AlexInput, IAlexInputProps } from './AlexInput.tsx'

export enum EInputType {
    email = 'email',
    password = 'password'
}

interface IProps extends Omit<IAlexInputProps, 'value' | 'onChange'> {
    name: string
    required?: boolean
    validateFunctions?: {
        [key: string
            ]:
            (valueToCheck: string) => boolean | string
    }
}

const DEBUG = false
const DEBUG_PREFIX = 'ALEX_INPUT'

export const AlexInputControlled: FC<IProps> = ({
                                                    name,
                                                    defaultValue,
                                                    label,
                                                    required = false,
                                                    validateFunctions = undefined,
                                                    error = false,
                                                    errorText = undefined,
                                                    hidden = false,
                                                    multiline = false,
                                                    maxRows,
                                                    inputType = undefined,
                                                    ...props
                                                }) => {

    const { control } = useFormContext()

    return (
        <Controller
            name={name}
            defaultValue={defaultValue}
            control={control}
            rules={{
                validate: {
                    required: required ? (value: string) => value?.length > 0 || 'обязательное поле' : () => true,
                    ...validateFunctions,
                },
            }}
            render={({ field: { onChange, value } }) => {
                DEBUG && console.log(DEBUG_PREFIX, 'value', value)
                return (
                    <AlexInput onChange={onChange} value={value} error={error} label={label} maxRows={maxRows}
                               multiline={multiline} errorText={errorText} inputType={inputType}
                               hidden={hidden} {...props}/>
                )
            }
            }
        />
    )
}
