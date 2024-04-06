import React, { FC, ReactElement } from 'react'
import { Stack, Typography, useTheme } from '@mui/material'

export interface IAlexFilter {
    label: string,
    component: ReactElement
}

interface IProps {
    config: IAlexFilter
    id: string
}

export const AlexFilter: FC<IProps> = ({
                                           config,
                                           id,
                                       }) => {
    const theme = useTheme()
    const { label, component } = config

    return (
        <Stack direction={'column'} spacing={theme.spacing(1)}>
            <Typography variant={'h6'}>{label}</Typography>
            {React.cloneElement(component, {
                'name': id,
            })}
        </Stack>
    )
}