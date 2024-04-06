import React, { FC, useEffect, useMemo } from 'react'
import { Box, CircularProgress, Grid, Stack, Typography } from '@mui/material'
import { theme } from '../../theme/theme'
import { AlexDataView } from '../../../shared-react-components/form-utils/AlexDataView/AlexDataView'
import { useLazyQuery, useQuery } from '@apollo/client'
import { CabinetPageGetMeDocument, CabinetPageGetMeQuery } from '../../../types/graphql/graphql.ts'
import { AlexChip } from '../../../shared-react-components/AlexChip/AlexChip.tsx'
import { AlexContentProvider } from '../../../shared-react-components/alex-content/alex-content-provider.component.tsx'
import { EERoleToRusName } from '../../enum/erole-to-rus-name.enum.ts'


interface IProps {
}

export const CabinetPage: FC<IProps> = () => {
    const [lazyGetMeQuery, {
        data: getMeQueryData,
        loading: getMeQueryDataLoading,
    }] = useLazyQuery<CabinetPageGetMeQuery>(CabinetPageGetMeDocument)

    useEffect(() => {
        lazyGetMeQuery()
    },[])

    const meData = useMemo(() => getMeQueryData?.user.recordMe, [getMeQueryData])

    return (
        <Box sx={{
            width: '100%',
            display: 'flex',
            height: '100%',
            flex: 1,
            overflowY: 'scroll',
        }}>
            {getMeQueryDataLoading && (
                <Box sx={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    <CircularProgress/>
                </Box>
            )}
            {(!getMeQueryDataLoading && meData) && (
                <Box sx={{
                    width: '100%',
                    padding: theme.spacing(2),
                    boxSizing: 'border-box',
                }}>
                    <AlexContentProvider pointConfig={[
                        {
                            name: 'main',
                            title: 'Основная информация',
                            body: (
                                <Grid container spacing={theme.spacing(2)}>
                                    <Grid item xs={6}>
                                        <AlexDataView label={'ID'}>
                                            {meData.id}
                                        </AlexDataView>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <AlexDataView label={'Почта'}>
                                            {meData.email}
                                        </AlexDataView>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <AlexDataView label={'Роль сервиса авторизации'}>
                                            <Box>
                                                <AlexChip label={EERoleToRusName[meData.role]} sx={{ width: '100px' }}/>
                                            </Box>
                                        </AlexDataView>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <AlexDataView label={'Дата создания'}>
                                            {meData.createdAt}
                                        </AlexDataView>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <AlexDataView label={'Дата последнего изменения'}>
                                            {meData.updatedAt}
                                        </AlexDataView>
                                    </Grid>
                                </Grid>
                            ),
                        },
                        {
                            name: 'externalServices',
                            title: 'Внешние сервисы',
                            body: (<>
                                {meData.externalServices.length ? (
                                    <Stack direction={'row'} spacing={theme.spacing(1)}>
                                        {meData.externalServices.map((item) => (
                                            <AlexChip label={`${item.name}`} key={item.id}/>
                                        ))}
                                    </Stack>
                                ) : (
                                    <Typography variant={'subtitle1'}>Пользователь не подключён ни к одному внешнему сервису</Typography>
                                )}
                            </>),
                        },
                        {
                            name: 'externalRoles',
                            title: 'Роли во внешних сервисах',
                            body: (<>
                                {meData.externalServices.length ? (
                                    <Stack direction={'row'} spacing={theme.spacing(1)}>
                                        {meData.externalRoles.map((item) => (
                                            <AlexChip label={`${item.externalService.name}:${item.name}`} key={item.id}/>
                                        ))}
                                    </Stack>
                                ) : (
                                    <Typography variant={'subtitle1'}>Пользователь не имеет ролей во внешних сервисах</Typography>
                                )}
                            </>),
                        },
                    ]}/>
                </Box>
            )}
        </Box>
    )
}