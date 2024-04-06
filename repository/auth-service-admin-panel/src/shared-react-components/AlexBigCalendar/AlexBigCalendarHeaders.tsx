import { FC } from 'react'
import { Grid, Stack, Typography, useTheme } from '@mui/material'
import { MAP_NUMBER_TO_DAY_RUS } from './AlexBigCalendarGlobaConstants.ts'

type TAlexBigCalendarHeader = {
    name: string
}

interface IProps {
}

export const AlexBigCalendarHeaders: FC<IProps> = () => {
    const theme = useTheme()

    return (
        [1, 2, 3, 4, 5, 6, 0].map((value) => {
            return (
                <Grid item xs={12 / 7}>
                    <Stack direction={'row'} alignItems={'center'} justifyContent={'center'} padding={theme.spacing(2)}
                           bgcolor={'white'} sx={{ height: 'calc(100% - 32px)' }}>
                        <Typography>{MAP_NUMBER_TO_DAY_RUS.get(value)}</Typography>
                    </Stack>
                </Grid>
            )
        })
    )
}

