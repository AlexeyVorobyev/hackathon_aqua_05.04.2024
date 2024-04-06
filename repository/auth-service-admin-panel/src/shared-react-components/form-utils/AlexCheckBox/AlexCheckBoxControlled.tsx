import { FC } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { AlexCheckBox, IAlexCheckBoxProps } from './AlexCheckBox.tsx'

interface IAlexCheckBoxControlledProps extends Omit<IAlexCheckBoxProps, 'onChange' | 'value'> {
    name: string
}

export const AlexCheckBoxControlled: FC<IAlexCheckBoxControlledProps> = ({
                                                                             name,
                                                                             color,
                                                                             ...props
                                                                         }) => {
    const { control } = useFormContext()

    return (
        <Controller
            name={name}
            control={control}
            defaultValue={false}
            render={({ field: { onChange, value } }) => {
                return (value == false || value) && (
                    <AlexCheckBox onChange={onChange} checked={value} value={value}
                                  color={color} {...props}/>
                )
            }}
        />
    )
}