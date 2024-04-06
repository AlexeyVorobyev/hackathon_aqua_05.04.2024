import React, {FC, useEffect, useMemo} from 'react'
import {useSearchParams} from 'react-router-dom'
import {Box, CircularProgress, Grid, Stack} from '@mui/material'
import {theme} from '../../theme/theme'
import {AlexDataView} from '../../../shared-react-components/form-utils/AlexDataView/AlexDataView'
import {useLazyQuery} from '@apollo/client'
import {
    ExternalRoleCardGetExternalRoleRecordDocument,
    ExternalRoleCardGetExternalRoleRecordQuery,
    ExternalRoleCardGetExternalRoleRecordQueryVariables,
} from '../../../types/graphql/graphql.ts'
import {AlexContentProvider} from '../../../shared-react-components/alex-content/alex-content-provider.component.tsx'
import {AlexChip} from '../../../shared-react-components/AlexChip/AlexChip.tsx'

export const ExternalRoleCard: FC = () => {
    const [searchParams] = useSearchParams()

    const [lazyGetExternalRoleRecord, {
        data: externalRoleRecordQueryData,
        loading: externalRoleRecordQueryLoading,
    }] = useLazyQuery<ExternalRoleCardGetExternalRoleRecordQuery>(ExternalRoleCardGetExternalRoleRecordDocument)

    useEffect(() => {
        const id = searchParams.get('id')
        if (id) {
            lazyGetExternalRoleRecord({
                variables: {
                    input: {
                        id: id,
                    },
                } as ExternalRoleCardGetExternalRoleRecordQueryVariables,
            })
        }
    }, [searchParams])

    const externalRoleData = useMemo(() => externalRoleRecordQueryData?.externalRole.record, [externalRoleRecordQueryData])

    return (
        <Box sx={{
            width: '100%',
            display: 'flex',
            flex: 1,
            overflowY: 'scroll',
        }}>
            {externalRoleRecordQueryLoading && (
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
            {(!externalRoleRecordQueryLoading && externalRoleData) && (
                <Box sx={{
                    width: '100%',
                    padding: theme.spacing(2),
                    boxSizing: 'border-box',
                }}>
                    <AlexContentProvider pointConfig={[
                        {
                            name: 'mainCardExternalRole',
                            title: 'Основная информация',
                            body: (
                                <Grid container spacing={theme.spacing(2)}>
                                    <Grid item xs={6}>
                                        <AlexDataView label={'Название'}>
                                            {externalRoleData.name}
                                        </AlexDataView>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <AlexDataView label={'Внешний сервис'}>
                                            <Stack direction={'row'} spacing={theme.spacing(1)}>
                                                <AlexChip label={externalRoleData.externalService.name}/>
                                            </Stack>
                                        </AlexDataView>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <AlexDataView label={'Описание'}>
                                            {externalRoleData.description}
                                        </AlexDataView>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <AlexDataView label={'Стандартная роль'}>
                                            {externalRoleData.default ? 'Да' : 'нет'}
                                        </AlexDataView>
                                    </Grid>
                                </Grid>
                            ),
                        },
                        {
                            name: 'exchangeDataCardExternalRole',
                            title: 'Параметры обмена',
                            body: (
                                <Grid container spacing={theme.spacing(2)}>
                                    <Grid item xs={6}>
                                        <AlexDataView label={'Ключ распознавания'}>
                                            {externalRoleData.recognitionKey}
                                        </AlexDataView>
                                    </Grid>
                                </Grid>
                            ),
                        },
                        {
                            name: 'internalCardExternalRole',
                            title: 'Служебная информация',
                            body: (
                                <Grid container spacing={theme.spacing(2)}>
                                    <Grid item xs={6}>
                                        <AlexDataView label={'ID'}>
                                            {externalRoleData.id}
                                        </AlexDataView>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <AlexDataView label={'Дата создания'}>
                                            {externalRoleData.createdAt}
                                        </AlexDataView>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <AlexDataView label={'Дата последнего изменения'}>
                                            {externalRoleData.updatedAt}
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