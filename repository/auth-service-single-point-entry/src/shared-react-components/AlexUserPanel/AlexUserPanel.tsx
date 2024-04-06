import React, { FC, useState } from 'react'
import { Button, IconButton, Paper, Popover, Stack, Typography, useTheme } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import { AlexLink } from '../AlexLink/AlexLink.tsx'

export const AlexUserPanel: FC = () => {
    const theme = useTheme()
    const [openButtonPopover, setOpenButtonPopover] = useState<boolean>(false)
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget)
        setOpenButtonPopover(!openButtonPopover)
    }

    return (
        <Stack direction={'row'} alignItems={'center'} spacing={1}>
            <AlexLink to={'/cabinet'}>
                <IconButton>
                    <AccountCircleIcon style={{ color: theme.palette.primary.contrastText }}/>
                </IconButton>
            </AlexLink>
            <AlexLink to={'/cabinet'}>
                <Typography variant={'subtitle1'} sx={{ cursor: 'pointer' }} color={theme.palette.primary.contrastText}>
                    Личный кабинет
                </Typography>
            </AlexLink>
            <IconButton onClick={handleClick}>
                <CloseIcon style={{ color: theme.palette.primary.contrastText }}/>
            </IconButton>
            <Popover
                open={openButtonPopover}
                anchorEl={anchorEl}
                sx={{
                    zIndex: 100000,
                }}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
            >
                <Paper elevation={3} sx={{ padding: '10px' }}>
                    <Stack direction={'column'} spacing={theme.spacing(1)} alignItems={'center'}>
                        <Typography variant={'subtitle1'}>Выйти из аккаунта?</Typography>
                        <Stack direction={'row'} spacing={theme.spacing(1)}>
                            <Button size={'large'}
                                    sx={{
                                        width: '80px',
                                    }}
                                    color={'error'}
                                    onClick={() => {
                                        localStorage.clear()
                                        location.reload()
                                    }}
                                    variant="contained">
                                Да
                            </Button>
                            <Button size={'large'}
                                    sx={{
                                        width: '80px',
                                    }}
                                    color={'neutral'}
                                    onClick={() => setOpenButtonPopover(false)}
                                    variant="outlined">
                                Нет
                            </Button>
                        </Stack>
                    </Stack>
                </Paper>
            </Popover>
        </Stack>
    )
}