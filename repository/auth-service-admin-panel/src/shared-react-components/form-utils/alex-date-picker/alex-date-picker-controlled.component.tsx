import { FC } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { AlexDatePicker, TAlexDatePickerPropsOmit } from './alex-date-picker.component.tsx'

type TAlexDatePickerControlledProps = {
    name: string
    label: string,
} & TAlexDatePickerPropsOmit

export const AlexDatePickerControlled: FC<TAlexDatePickerControlledProps> = ({
                                                                                 name,
                                                                                 label,
                                                                                 ...props
                                                                             }) => {
    const { control } = useFormContext()

    return (
        <Controller
            name={name}
            control={control}
            render={({ field: { onChange, value } }) => (
                <AlexDatePicker value={value} onChange={onChange}
                                label={label} {...props}/>
            )}/>
    )
}