import { FC } from 'react'
import Checkbox, { CheckboxProps } from '@mui/material/Checkbox'
import { FormControl } from '@mui/material'

type TColor = {
    outline?: string,
    checked?: string
}

export interface IAlexCheckBoxProps extends Omit<CheckboxProps, 'color' | 'size'> {
    color?: TColor
    size?: number
}

/**
 *  Component that changes the underlying behavior of the wrapped Checkbox MUI component
 * */
export const AlexCheckBox: FC<IAlexCheckBoxProps> = ({
                                                         color,
                                                         size,
                                                         ...props
                                                     }) => (
    <FormControl fullWidth={false}>
        <Checkbox
            {...props}
            sx={{
                color: color?.outline,
                '&.Mui-checked': {
                    color: color?.checked,
                },
                '&.Mui-disabled': {
                    color: color?.outline,
                },
                '& .MuiSvgIcon-root': {
                    fontSize: size,
                },
            }}
        />
    </FormControl>
)