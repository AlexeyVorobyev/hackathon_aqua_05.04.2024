import React, { FC, ReactNode, useCallback, useMemo, useState } from 'react'
import { Collapse, ListItemButton, ListItemIcon, ListItemText, Tooltip, Typography } from '@mui/material'
import { ExpandLess, ExpandMore } from '@mui/icons-material'
import { useLocation } from 'react-router-dom'
import { theme } from '../../components/theme/theme.ts'
import { checkLocation } from '../functions/checkLocation.ts'
import { AlexLink } from '../AlexLink/AlexLink.tsx'


interface IAlexSideNavigationItemProps {
    name: string,
    path: string | null,
    icon?: ReactNode
    isContracted: boolean
    setIsContracted: React.Dispatch<React.SetStateAction<boolean>>
    children?: ReactNode
    enableOpenOnSelect?: boolean
}

export const AlexSideNavigationItem: FC<IAlexSideNavigationItemProps> = ({
                                                                             name,
                                                                             path,
                                                                             icon,
                                                                             isContracted,
                                                                             setIsContracted,
                                                                             children,
                                                                             enableOpenOnSelect = false
                                                                         }) => {

    const [open, setOpen] = useState<boolean>(false)
    const location = useLocation()

    const isCurrentLocation = path ? useMemo(() => checkLocation(location.pathname, path), [location, path]) : null

    const handleClick = path ? (
        useCallback(() => {
            if (enableOpenOnSelect) {
                setIsContracted(!isContracted)
            }
        }, [isContracted])
    ) : (
        useCallback(() => {
            if (enableOpenOnSelect) {
                setOpen(!open)
            }
            else {
                setIsContracted(false)
                isContracted && setOpen(true)
                !isContracted && setOpen(!open)
            }
        }, [open, isContracted])
    )

    return (<>
        <AlexLink to={path} disable={'/' + path === location.pathname}>
            <Tooltip title={isContracted ? name : null} placement={'right'}>
                <ListItemButton onClick={handleClick}
                                sx={{
                                    padding: theme.spacing(1),
                                    paddingLeft: theme.spacing(2),
                                    height: '48px',
                                }}>
                    {icon && (
                        <ListItemIcon
                            sx={{ color: !(isContracted && isCurrentLocation) ? undefined : theme.palette.secondary.main }}>
                            {icon}
                        </ListItemIcon>
                    )}
                    {name && (
                        <ListItemText
                            disableTypography
                            sx={{
                                transform: isCurrentLocation ? `translate(-${theme.spacing(1)})` : undefined,
                                transition: 'all 1s',
                                opacity: isContracted ? '0' : '1',
                            }}>
                            <Typography
                                color={isCurrentLocation ? theme.palette.secondary.main : theme.palette.text.primary}
                                sx={{ width: 'max-content' }}
                            >{name}</Typography>
                        </ListItemText>
                    )}
                    {(children && !isContracted && open) && (
                        <ExpandLess sx={{ color: theme.palette.text.primary }}/>
                    )}
                    {(children && !isContracted && !open) && (
                        <ExpandMore sx={{ color: theme.palette.text.primary }}/>
                    )}
                </ListItemButton>
            </Tooltip>
        </AlexLink>
        {children && (
            <Collapse in={open && !isContracted}>
                {children}
            </Collapse>
        )}
    </>)
}
