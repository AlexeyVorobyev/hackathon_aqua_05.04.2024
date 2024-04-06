import { FC } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { AlexDatePeriodPicker, IAlexDatePeriodPickerProps } from './alex-date-period-picker.component.tsx'

interface IAlexDatePeriodPickerControlledProps extends Omit<IAlexDatePeriodPickerProps, 'value' | 'onChange'> {
    name: string
}

export const AlexDatePeriodPickerControlled: FC<IAlexDatePeriodPickerControlledProps> = ({
                                                                                             name,
                                                                                             ...props
                                                                                         }) => {
    const { control } = useFormContext()

    return (
        <Controller
            name={name}
            control={control}
            render={({ field: { onChange, value } }) => (
                <AlexDatePeriodPicker value={value} onChange={onChange} {...props}/>
            )}/>
    )
}