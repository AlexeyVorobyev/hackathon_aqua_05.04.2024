import { FC, ReactElement, ReactNode, useState } from 'react'
import { Box, Grid, Stack, useTheme } from '@mui/material'
import { AlexContentPoint } from './alex-content-point.component.tsx'
import { AlexContentMenuItem } from './alex-content-menu-item.component.tsx'
import { theme } from '../../components/theme/theme.ts'

export type TAlexContentPointConfig = {
    name: string
    title: string
    body: ReactNode
    contractible?: boolean
    open?: boolean
}

export type TAlexContentConfig = {
    ratioMenuPoints?: [number, number]
    menuBackgroundColor?: string
    menuTopOffsetWhileSticky?: number
}

interface IAlexContentProviderProps {
    pointConfig: TAlexContentPointConfig[]
    config?: TAlexContentConfig
}

/**
 * Component with table of contents
 * */
export const AlexContentProvider: FC<IAlexContentProviderProps> = ({
                                                                       pointConfig,
                                                                       config,
                                                                   }) => {
    const theme = useTheme()
    const [
        paperHovered,
        setPaperHovered,
    ] = useState<string | null>(null)

    return (
        <Grid container direction={'row'} width={'100%'} height={'100%'} columnSpacing={theme.spacing(3)}>
            <Grid item xs={config?.ratioMenuPoints?.length ? config.ratioMenuPoints[0] : 2}>
                <Box style={{
                    position: 'sticky',
                    top: config?.menuTopOffsetWhileSticky || 16,
                    zIndex: 100
                }}>
                    <Stack justifyContent={'center'} direction={'column'}
                           padding={theme.spacing(1)} borderRadius={'8px'}
                           sx={{ backgroundColor: config?.menuBackgroundColor || '#F7F7F7' }}>
                        {pointConfig.map((item) => (
                            <AlexContentMenuItem paperHovered={paperHovered}
                                                 config={{
                                                     name: item.name,
                                                     title: item.title,
                                                 }}/>
                        ))}
                    </Stack>
                </Box>
            </Grid>
            <Grid item xs={config?.ratioMenuPoints?.length ? config.ratioMenuPoints[1] : 10}>
                <Stack direction={'column'} gap={theme.spacing(3)} sx={{
                    '&::after': {
                        content: '""',
                        display: 'block',
                        bottom: `-${theme.spacing(2)}`,
                        height: 0,
                    },
                }}>
                    {pointConfig.map((item) => (
                        <AlexContentPoint name={item.name} title={item.title}
                                          contractible={item.contractible} open={item.open}
                                          setPaperHovered={setPaperHovered}>
                            {item.body}
                        </AlexContentPoint>
                    ))}
                </Stack>
            </Grid>
        </Grid>
    )
}