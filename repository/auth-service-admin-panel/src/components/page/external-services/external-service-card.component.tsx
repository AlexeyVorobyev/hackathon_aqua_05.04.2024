import React, { FC, useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Box, CircularProgress, Grid, Stack, Typography } from '@mui/material'
import { theme } from '../../theme/theme'
import { AlexDataView } from '../../../shared-react-components/form-utils/AlexDataView/AlexDataView'
import { useLazyQuery } from '@apollo/client'
import {
    ExternalServiceCardGetExternalServiceRecordDocument,
    ExternalServiceCardGetExternalServiceRecordQuery,
    ExternalServiceCardGetExternalServiceRecordQueryVariables,
} from '../../../types/graphql/graphql.ts'
import { AlexContentProvider } from '../../../shared-react-components/alex-content/alex-content-provider.component.tsx'
import { AlexChip } from '../../../shared-react-components/AlexChip/AlexChip.tsx'

export const ExternalServiceCard: FC = () => {
    const [searchParams] = useSearchParams()

    const [lazyGetExternalServiceRecord, {
        data: externalServiceRecordQueryData,
        loading: externalServiceRecordQueryLoading,
    }] = useLazyQuery<ExternalServiceCardGetExternalServiceRecordQuery>(ExternalServiceCardGetExternalServiceRecordDocument)

    useEffect(() => {
        const id = searchParams.get('id')
        if (id) {
            lazyGetExternalServiceRecord({
                variables: {
                    input: {
                        id: id,
                    },
                } as ExternalServiceCardGetExternalServiceRecordQueryVariables,
            })
        }
    }, [searchParams])

    const externalServiceData = useMemo(() => externalServiceRecordQueryData?.externalService.record, [externalServiceRecordQueryData])

    return (
        <Box sx={{
            width: '100%',
            display: 'flex',
            flex: 1,
            overflowY: 'scroll',
        }}>
            {externalServiceRecordQueryLoading && (
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
            {(!externalServiceRecordQueryLoading && externalServiceData) && (
                <Box sx={{
                    width: '100%',
                    padding: theme.spacing(2),
                    boxSizing: 'border-box',
                }}>
                    <AlexContentProvider pointConfig={[
                        {
                            name: 'mainCardExternalService',
                            title: 'Основная информация',
                            body: (
                                <Grid container spacing={theme.spacing(2)}>
                                    <Grid item xs={6}>
                                        <AlexDataView label={'Название'}>
                                            {externalServiceData.name}
                                        </AlexDataView>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <AlexDataView label={'Описание'}>
                                            {externalServiceData.description}
                                        </AlexDataView>
                                    </Grid>
                                </Grid>
                            ),
                        },
                        {
                            name: 'exchangeDataCardExternalService',
                            title: 'Параметры обмена',
                            body: (
                                <Grid container spacing={theme.spacing(2)}>
                                    <Grid item xs={6}>
                                        <AlexDataView label={'Ключ распознавания'}>
                                            {externalServiceData.recognitionKey}
                                        </AlexDataView>
                                    </Grid>
                                </Grid>
                            )
                        },
                        {
                            name: 'externalRolesCardExternalService',
                            title: 'Роли',
                            body: (<>
                                {externalServiceData.externalRoles.length ? (
                                    <Stack direction={'row'} spacing={theme.spacing(1)}>
                                        {externalServiceData.externalRoles.map((item) => (
                                            <AlexChip label={item.name} key={item.id}/>
                                        ))}
                                    </Stack>
                                ) : (
                                    <Typography variant={'subtitle1'}>Сервис не имеет ролей</Typography>
                                )}
                            </>),
                        },
                        {
                            name: 'internalCardExternalService',
                            title: 'Служебная информация',
                            body: (
                                <Grid container spacing={theme.spacing(2)}>
                                    <Grid item xs={6}>
                                        <AlexDataView label={'ID'}>
                                            {externalServiceData.id}
                                        </AlexDataView>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <AlexDataView label={'Дата создания'}>
                                            {externalServiceData.createdAt}
                                        </AlexDataView>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <AlexDataView label={'Дата последнего изменения'}>
                                            {externalServiceData.updatedAt}
                                        </AlexDataView>
                                    </Grid>
                                </Grid>
                            ),
                        },
                    ]}/>
                </Box>)}
        </Box>
    )
}