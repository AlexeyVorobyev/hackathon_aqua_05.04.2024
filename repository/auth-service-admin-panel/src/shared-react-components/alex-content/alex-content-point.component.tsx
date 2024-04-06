import React, { FC, ReactNode, useCallback, useRef, useState } from 'react'
import { Box, Divider, Paper, Stack, Switch, Tooltip, Typography, useTheme } from '@mui/material'
import { EUsePageStateMode, useAlexPageState } from '../functions/useAlexPageState/useAlexPageState.tsx'

enum EAlexContentPointStoredOptions {
    open = 'open'
}

interface IAlexContentPointProps {
    name: string
    title: string
    setPaperHovered: React.Dispatch<React.SetStateAction<string | null>>
    children: ReactNode
    contractible?: boolean
    open?: boolean
}

export const AlexContentPoint: FC<IAlexContentPointProps> = ({
                                                                 name,
                                                                 title,
                                                                 setPaperHovered,
                                                                 children,
                                                                 contractible = true,
                                                                 open = true,
                                                             }) => {
    const theme = useTheme()

    const {
        storedOptions,
        setStoredOptions,
    } = useAlexPageState({
        modeWrite: [EUsePageStateMode.sessionStorage],
        modeRead: [EUsePageStateMode.sessionStorage],
        storageKey: name,
        defaultValue: new Map([
            [EAlexContentPointStoredOptions.open, open],
        ]),
    })

    const [clip, setClip] = useState<boolean>(
        !storedOptions.get(EAlexContentPointStoredOptions.open),
    )

    const handleTimeoutClip = useCallback(() => {
        if (!refForClip.current) {
            setClip(true)
        }
    }, [storedOptions])

    const refForClip = useRef<boolean>(clip)

    const handleOnChange = (event: any, checked: boolean) => {
        setStoredOptions((prevState) => {
            prevState.set(EAlexContentPointStoredOptions.open, checked)
            return new Map(prevState)
        })

        refForClip.current = checked

        if (checked) {
            setClip(false)
        } else {
            setTimeout(handleTimeoutClip, 1000)
        }
    }

    const refChildren = useRef<HTMLElement>()

    return (
        <Paper elevation={0} id={name}
               onMouseOver={() => setPaperHovered(name)}
               onMouseLeave={() => setPaperHovered(null)}>
            <Stack direction={'column'}>
                <Stack direction={'row'} spacing={theme.spacing(2)} alignItems={'center'}>
                    <Typography variant={'h4'}>
                        {title}
                    </Typography>
                    {contractible && (
                        <Tooltip
                            title={storedOptions.get(EAlexContentPointStoredOptions.open) ? 'Свернуть' : 'Раскрыть'}>
                            <Switch key={name} value={storedOptions.get(EAlexContentPointStoredOptions.open)}
                                    onChange={handleOnChange}
                                    checked={storedOptions.get(EAlexContentPointStoredOptions.open)}/>
                        </Tooltip>
                    )}
                </Stack>
                <Divider sx={{
                    maxHeight: storedOptions.get(EAlexContentPointStoredOptions.open)
                        ? 40
                        : 0,
                    opacity: storedOptions.get(EAlexContentPointStoredOptions.open)
                        ? 1
                        : 0,
                    transition: `
                        max-height 1s, 
                        opacity 1s,
                        margin 1s
                    `,
                    marginTop: storedOptions.get(EAlexContentPointStoredOptions.open)
                        ? theme.spacing(1)
                        : 0,
                    marginBottom: storedOptions.get(EAlexContentPointStoredOptions.open)
                        ? theme.spacing(2)
                        : 0,
                }}/>
                <Box sx={{
                    maxHeight: storedOptions.get(EAlexContentPointStoredOptions.open)
                        ? refChildren?.current?.getBoundingClientRect().height
                        : 0,
                    opacity: storedOptions.get(EAlexContentPointStoredOptions.open)
                        ? 1
                        : 0,
                    overflowY: clip
                        ? 'clip'
                        : 'visible',
                    transition: `
                        max-height 1s, 
                        opacity ${storedOptions.get(EAlexContentPointStoredOptions.open) ? '1s' : '0.5s'}
                    `,
                }}>
                    <Box ref={refChildren}>
                        {children}
                    </Box>
                </Box>
            </Stack>
        </Paper>
    )
}