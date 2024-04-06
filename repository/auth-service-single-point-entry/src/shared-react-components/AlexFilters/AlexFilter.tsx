import { FC, ReactElement } from 'react'
import { Stack, Typography, useTheme } from '@mui/material'

export interface IAlexFilter {
    label: string,
    component: ReactElement
}

interface IProps {
    config: IAlexFilter
}

export const AlexFilter: FC<IProps> = ({
                                           config
                                       }) => {
    const theme = useTheme()
    const {label, component} = config

    return (
        <Stack direction={'column'} spacing={theme.spacing(1)}>
            <Typography variant={'h6'}>{label}</Typography>
            {component}
        </Stack>
    )
}