import { FC, ReactNode, useCallback, useMemo, useState } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { Box, Button, Divider, Stack, Typography } from '@mui/material'
import { theme } from '../../theme/theme'
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn'
import { AlexDialogButton } from '../../../shared-react-components/AlexDialog/AlexDialogButton'
import { FormProvider, useForm } from 'react-hook-form'
import { AlexLink } from '../../../shared-react-components/AlexLink/AlexLink.tsx'
import { useMutation } from '@apollo/client'
import { DocumentNode } from 'graphql'

export enum EPageType {
    edit = 'edit',
    add = 'add',
    view = 'view',
    table = 'table'
}

type TPageState = EPageType.edit | EPageType.add | EPageType.view | EPageType.table

export type TCustomizationPageConfig = {
    deleteQueryDocument: DocumentNode
    [EPageType.table]: {
        component: ReactNode,
        title: string,
        button: string
    },
    [EPageType.view]?: {
        component: ReactNode,
        button: string
    },
    [EPageType.add]?: {
        component: FC<any>,
        title: string
    },
    [EPageType.edit]?: {
        component: FC<any>,
        title: string
    },
}

interface ICustomizationPageProps {
    config: Map<string, TCustomizationPageConfig>
}

export const CustomizationPage: FC<ICustomizationPageProps> = ({ config }) => {
    const location = useLocation()
    const pageState = useMemo(() => location.pathname.split('/')[location.pathname.split('/').length - 1] as TPageState, [location])
    const namespace = useMemo(() => location.pathname.split('/')[location.pathname.split('/').length - 2], [location])
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()

    const [deleteMutation] = useMutation(config.get(namespace)!.deleteQueryDocument)


    const deleteQueryDecorator = useCallback(() => {
        return (id: string) => {
            deleteMutation({
                variables: {
                    input: {
                        id: id,
                    },
                },
            })
                .then(() => {
                    if (searchParams.get('from')) {
                        navigate(JSON.parse(searchParams.get('from')!))
                    } else {
                        navigate('./../table')
                    }
                })
        }
    }, [searchParams])

    const deleteQueryDecorated = useMemo(() => deleteQueryDecorator(), [namespace, config])

    const SwitchRender = useCallback(() => {
        switch (pageState) {
            case EPageType.view:
                return (<>
                    <Stack direction={'row'} spacing={theme.spacing(2)} padding={theme.spacing(2)}
                           justifyContent={'flex-end'} useFlexGap>
                        <AlexLink to={-1} useNavigateProp sx={{ marginRight: 'auto' }}>
                            <Button variant={'contained'} startIcon={<KeyboardReturnIcon/>}>
                                <Typography
                                    variant={'button'}>Назад</Typography>
                            </Button>
                        </AlexLink>
                        {deleteQueryDecorated! && (
                            <AlexDialogButton
                                button={
                                    <Button variant={'contained'} color={'error'}>
                                        <Typography variant={'button'}>
                                            Удалить {(config.get(namespace)!)[pageState]!.button}
                                        </Typography>
                                    </Button>
                                }
                                dialog={{
                                    title: 'Подтвердите удаление',
                                    body: (
                                        <Stack direction={'row'} spacing={theme.spacing(2)} padding={theme.spacing(2)}>
                                            <Button
                                                id={'confirmButton'}
                                                sx={{ width: '140px' }}
                                                color={'error'}
                                                variant={'contained'}>
                                                <Typography variant={'button'}
                                                            color={theme.palette.error.contrastText}>Удалить</Typography>
                                            </Button>
                                            <Button
                                                id={'cancelButton'}
                                                sx={{ width: '140px' }}
                                                color={'neutral'}
                                                variant={'outlined'}>
                                                <Typography variant={'button'}
                                                            color={theme.palette.neutral.notContrastText}>Отмена</Typography>
                                            </Button>
                                        </Stack>
                                    ),
                                    functionsAssign: {
                                        'cancelButton': {
                                            close: true,
                                        },
                                        'confirmButton': {
                                            close: true,
                                            function: () => deleteQueryDecorated(searchParams.get('id')!),
                                        },
                                    },
                                }}/>)}
                        {config.get(namespace)![EPageType.edit] && (
                            <AlexLink to={`./../edit?id=${searchParams.get('id')}`}>
                                <Button variant={'contained'}>
                                    <Typography
                                        variant={'button'}>Редактировать {(config.get(namespace)!)[pageState]!.button}</Typography>
                                </Button>
                            </AlexLink>
                        )}
                    </Stack>
                </>)
            case EPageType.add:
            case EPageType.edit:
                const [onSubmitFunc, setOnSubmitFunc] = useState<{
                    callback: ((data: any) => void) | null
                }>({ callback: null })
                const methods = useForm()
                const Form = (config.get(namespace)!)[pageState]!.component
                return (<>
                    <FormProvider {...methods}>
                        <Stack height={'100%'} width={'100%'} direction={'column'}>
                            <Stack direction={'row'} spacing={theme.spacing(2)} padding={theme.spacing(2)}
                                   justifyContent={'space-between'}>
                                <Typography variant={'h6'}>
                                    {pageState === EPageType.edit ? 'Настройка' : 'Добавление'} {(config.get(namespace)!)[pageState]!.title}
                                </Typography>
                                <Stack direction={'row'} spacing={theme.spacing(2)} alignItems={'center'}>
                                    <AlexLink to={-1} useNavigateProp>
                                        <Button variant={'outlined'} color={'neutral'}>
                                            <Typography
                                                color={theme.palette.neutral.notContrastText}
                                                variant={'button'}>Отмена</Typography>
                                        </Button>
                                    </AlexLink>
                                    {onSubmitFunc.callback && (
                                        <Button variant={'contained'} type={'submit'}
                                                onClick={methods.handleSubmit(onSubmitFunc.callback)}>
                                            <Typography variant={'button'}>
                                                Сохранить
                                            </Typography>
                                        </Button>
                                    )}
                                </Stack>
                            </Stack>
                            <Divider/>
                            <Box sx={{ display: 'flex', flex: 1, height: 0 }}>
                                <Form setOnSubmitFunc={setOnSubmitFunc} edit={pageState === EPageType.edit}/>
                            </Box>
                        </Stack>
                    </FormProvider>
                </>)
            case EPageType.table:
                return (<>
                    <Stack direction={'row'} spacing={theme.spacing(2)} padding={theme.spacing(2)}
                           justifyContent={'space-between'}>
                        <Typography
                            variant={'h6'}>Настройка {(config.get(namespace)!)[pageState].title}</Typography>
                        {config.get(namespace)![EPageType.add] && (
                            <AlexLink
                                to={`./../add?${(new URLSearchParams([['from', JSON.stringify(location.pathname + location.search)]])).toString()}`}>
                                <Button variant={'contained'}>
                                    <Typography variant={'button'}>
                                        Добавить {(config.get(namespace)!)[pageState].button}
                                    </Typography>
                                </Button>
                            </AlexLink>
                        )}
                    </Stack>
                </>)
        }
    }, [pageState, location, namespace, searchParams])

    return (<>
        {(pageState === EPageType.add || pageState === EPageType.edit) ? (
            <SwitchRender/>
        ) : (
            <Stack height={'100%'} width={'100%'} direction={'column'}>
                <SwitchRender/>
                <Divider/>
                <Box sx={{ display: 'flex', flex: 1, height: 0 }}>
                    {(config.get(namespace)!)[pageState]!.component}
                </Box>
            </Stack>
        )}
    </>)
}