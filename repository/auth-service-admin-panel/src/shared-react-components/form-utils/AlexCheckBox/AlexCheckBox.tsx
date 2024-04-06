import { FC } from 'react'
import Checkbox, { CheckboxProps } from '@mui/material/Checkbox'
import { FormControl, InputLabel, Stack, Typography, useTheme } from '@mui/material'

type TColor = {
    outline?: string,
    checked?: string
}

export interface IAlexCheckBoxProps extends Omit<CheckboxProps, 'color' | 'size'> {
    color?: TColor
    size?: number
    label?: string
    justifyContent?: 'center' | 'start' | 'end'
}

/**
 *  Component that changes the underlying behavior of the wrapped Checkbox MUI component
 * */
export const AlexCheckBox: FC<IAlexCheckBoxProps> = ({
                                                         color = {
                                                             outline: '#666666',
                                                             checked: '#333333',
                                                         },
                                                         size = 10,
                                                         label,
                                                         value,
                                                         justifyContent = 'center',
                                                         ...props
                                                     }) => {
    const theme = useTheme()

    return (
        <Stack alignItems={'center'} justifyContent={justifyContent}
               height={'100%'} width={'100%'} direction={'row'}
               spacing={theme.spacing(2)}>
            <Checkbox
                {...props}
                value={value}
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
            {label && (
                <InputLabel focused={Boolean(value)}>
                    <Typography variant={'h6'}>
                        {label}
                    </Typography>
                </InputLabel>
            )}
        </Stack>
    )
}
