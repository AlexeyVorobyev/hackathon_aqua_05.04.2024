import { FC, ReactNode, useCallback, useState } from 'react'
import { List, Stack, Switch, Tooltip, useTheme } from '@mui/material'
import { AlexSideNavigationItem } from './AlexSideNavigationItem.tsx'

export type TSideNavigationConfig = {
    path: string | null,
    name: string
    icon?: ReactNode
    routes?: TSideNavigationConfig[]
}

interface IAlexSideNavigationProps {
    config: TSideNavigationConfig[],
    enableOpenOnSelect?: boolean
}

export const AlexSideNavigation: FC<IAlexSideNavigationProps> = ({
                                                                     config,
                                                                     enableOpenOnSelect = false,
                                                                 }) => {
    const theme = useTheme()
    const [isContracted, setIsContracted] = useState<boolean>(true)

    const constructSideNavigation = useCallback((sideNavigationConfig: TSideNavigationConfig[]) => (
        sideNavigationConfig.map((item) => (
            item.routes ? (
                <AlexSideNavigationItem key={item.name} name={item.name} path={item.path}
                                        icon={item.icon} isContracted={isContracted}
                                        setIsContracted={setIsContracted}>
                    {constructSideNavigation(item.routes)}
                </AlexSideNavigationItem>
            ) : (
                <AlexSideNavigationItem key={item.name} name={item.name} path={item.path}
                                        icon={item.icon} isContracted={isContracted}
                                        setIsContracted={setIsContracted}/>
            )
        ))
    ), [config, isContracted])

    return (
        <Stack
            direction={'column'}
            justifyContent={'space-between'}
            sx={{
                width: isContracted ? '58px' : '400px',
                boxShadow: 2,
                transition: 'width 1s',
            }}
        >
            <List sx={{ padding: '0', overflow: 'hidden' }}>
                {constructSideNavigation(config)}
            </List>
            <Tooltip title={isContracted ? 'Раскрыть меню' : 'Свернуть меню'}>
                <Stack direction={'row'} spacing={theme.spacing(2)}>
                    <Switch checked={!isContracted} onChange={() => {
                        setIsContracted(!isContracted)
                    }} color={'secondary'}/>
                </Stack>
            </Tooltip>
        </Stack>
    )
}