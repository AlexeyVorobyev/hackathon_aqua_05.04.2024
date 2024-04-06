import { FC } from 'react'
import { DatePicker, DatePickerProps } from '@mui/x-date-pickers/DatePicker'
import { DateTimePicker, DateTimePickerProps, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3'
import { FormControl } from '@mui/material'

export enum EDatePickerType {
    date = 'date',
    dateTime = 'dateTime'
}


type TAlexDatePickerPropsDate = {
    type: EDatePickerType.date
} & DatePickerProps<any>

type TAlexDatePickerPropsDateTime = {
    type: EDatePickerType.dateTime
} & DateTimePickerProps<any>

type TAlexDatePickerPropsCommon = {
    value: string,
    onChange: (...events: any) => void
    type: EDatePickerType.date | EDatePickerType.dateTime
}

type TAlexDatePickerPropsCommonOmit = {
    type: EDatePickerType.date | EDatePickerType.dateTime
}

export type TAlexDatePickerPropsOmit =
    TAlexDatePickerPropsCommonOmit
    & (TAlexDatePickerPropsDateTime | TAlexDatePickerPropsDate)

export type TAlexDatePickerProps =
    TAlexDatePickerPropsCommon
    & (TAlexDatePickerPropsDateTime | TAlexDatePickerPropsDate)

export const AlexDatePicker: FC<TAlexDatePickerProps> = ({
                                                             value,
                                                             onChange,
                                                             type = EDatePickerType.date,
                                                             ...props
                                                         }) => {

    return (
        <FormControl fullWidth>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                {type === EDatePickerType.dateTime ? (
                    <DateTimePicker
                        value={value}
                        onChange={onChange}
                        {...props as TAlexDatePickerPropsDateTime}
                    />
                ) : (
                    <DatePicker
                        format="MM/dd/yyyy"
                        value={value}
                        onChange={onChange}
                        {...props as TAlexDatePickerPropsDate}
                    />
                )}
            </LocalizationProvider>
        </FormControl>
    )
}