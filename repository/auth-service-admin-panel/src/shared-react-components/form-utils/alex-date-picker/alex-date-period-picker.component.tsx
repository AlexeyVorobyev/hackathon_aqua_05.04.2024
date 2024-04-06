import { FC, useEffect, useLayoutEffect, useState } from 'react'
import { AlexDatePicker, TAlexDatePickerPropsOmit } from './alex-date-picker.component.tsx'
import { Stack, useTheme } from '@mui/material'

export type TAlexDatePeriodPickerValue = {
    startDate: string
    finishDate: string
}

export interface IAlexDatePeriodPickerProps {
    configFirstInput: TAlexDatePickerPropsOmit
    configSecondInput: TAlexDatePickerPropsOmit
    value: TAlexDatePeriodPickerValue
    onChange: (...events: any) => void
}


export const AlexDatePeriodPicker: FC<IAlexDatePeriodPickerProps> = ({
                                                                         configFirstInput,
                                                                         configSecondInput,
                                                                         value,
                                                                         onChange,
                                                                     }) => {
    const theme = useTheme()

    const [firstValue, setFirstValue] = useState<string>(value?.startDate)
    const [secondValue, setSecondValue] = useState<string>(value?.finishDate)

    useLayoutEffect(() => {
        if (value?.startDate) {
            setFirstValue(value.startDate)
        }
        if (value?.finishDate) {
            setSecondValue(value.finishDate)
        }
    }, [value])

    useEffect(() => {
        onChange({
            ...value,
            startDate: firstValue,
            finishDate: secondValue,
        } as TAlexDatePeriodPickerValue)
    }, [firstValue, secondValue])

    return (
        <Stack direction={'row'} spacing={theme.spacing(1)} alignItems={'center'}>
            <AlexDatePicker {...configFirstInput} value={firstValue} onChange={setFirstValue} maxDate={secondValue}/>
            <AlexDatePicker {...configSecondInput} value={secondValue} onChange={setSecondValue} minDate={firstValue}/>
        </Stack>
    )
}