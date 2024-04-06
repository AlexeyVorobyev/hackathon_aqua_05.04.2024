import React, {FC, useEffect, useLayoutEffect, useMemo, useRef} from 'react'
import {Box, CircularProgress, Grid} from '@mui/material'
import {useFormContext} from 'react-hook-form'
import {theme} from '../../theme/theme'
import {
    AlexInputControlled,
    EInputType,
} from '../../../shared-react-components/form-utils/AlexInput/AlexInputControlled.tsx'
import {useNavigate, useSearchParams} from 'react-router-dom'
import {extractIds} from '../../../shared-react-components/functions/extractIds'
import {
    AlexCheckBoxControlled,
} from '../../../shared-react-components/form-utils/AlexCheckBox/AlexCheckBoxControlled.tsx'
import {useLazyQuery, useMutation} from '@apollo/client'
import {
    ERole,
    TUserCreateInput,
    TUserUpdatePayloadInput,
    UserCardGetUserRecordDocument,
    UserCardGetUserRecordQuery,
    UserCardGetUserRecordQueryVariables,
    UserFormCreateUserDocument,
    UserFormCreateUserMutation,
    UserFormCreateUserMutationVariables,
    UserFormUpdateUserDocument,
    UserFormUpdateUserMutation,
    UserFormUpdateUserMutationVariables,
    ExternalServicesTableGetExternalServiceListDocument,
    ExternalServiceCardGetExternalServiceRecordDocument,
    ExternalServiceFormUpdateExternalServiceDocument,
    ExternalServiceFormCreateExternalServiceDocument,
    ExternalServiceCardGetExternalServiceRecordQuery,
    ExternalServiceCardGetExternalServiceRecordQueryVariables,
    TExternalServiceUpdateInput,
    TExternalServiceCreateInput,
    ExternalServiceFormCreateExternalServiceMutationVariables,
    ExternalServiceFormUpdateExternalServiceMutationVariables,
    ExternalRoleFormUpdateExternalRoleMutation,
    ExternalRoleFormCreateExternalRoleMutation,
    ExternalRoleFormUpdateExternalRoleDocument,
    ExternalRoleFormCreateExternalRoleDocument,
    ExternalRolesTableGetExternalRoleListDocument,
    ExternalRoleCardGetExternalRoleRecordQuery,
    ExternalRoleCardGetExternalRoleRecordDocument,
    ExternalRoleCardGetExternalRoleRecordQueryVariables,
    TExternalRoleUpdateInput,
    TExternalRoleCreateInput,
    ExternalRoleFormUpdateExternalRoleMutationVariables,
    ExternalRoleFormCreateExternalRoleMutationVariables,
    UserFormGetExternalServiceListForAutocompleteQuery, UserFormGetExternalServiceListForAutocompleteDocument,
} from '../../../types/graphql/graphql.ts'
import {EERoleToRusName} from '../../enum/erole-to-rus-name.enum.ts'
import {AlexContentProvider} from '../../../shared-react-components/alex-content/alex-content-provider.component.tsx'
import {validEmail, validPassword} from '../../../shared-react-components/form-utils/Regex/regex.ts'
import {AlexSelect} from '../../../shared-react-components/form-utils/AlexSelect/AlexSelect.tsx'
import {updatedDiff} from 'deep-object-diff'
import {
    AlexAutocompleteControlled,
} from '../../../shared-react-components/form-utils/alex-autocomplete/alex-autocomplete-controlled.component.tsx'

interface IExternalServiceFormProps {
    setOnSubmitFunc: React.Dispatch<React.SetStateAction<{ callback: ((data: any) => void) | null }>>
    edit: boolean
}

const DEBUG = true

export const ExternalRoleForm: FC<IExternalServiceFormProps> = ({
                                                                    setOnSubmitFunc,
                                                                    edit,
                                                                }) => {
    const {formState: {errors}, reset} = useFormContext()
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()

    const [updateExternalRoleMutation] = useMutation<ExternalRoleFormUpdateExternalRoleMutation>(ExternalRoleFormUpdateExternalRoleDocument, {
        refetchQueries: [
            {query: ExternalRolesTableGetExternalRoleListDocument},
        ],
    })

    const [createExternalRoleMutation] = useMutation<ExternalRoleFormCreateExternalRoleMutation>(ExternalRoleFormCreateExternalRoleDocument, {
        refetchQueries: [
            {query: ExternalRolesTableGetExternalRoleListDocument},
        ],
    })

    const [lazyGetExternalRoleRecord, {
        data: externalRoleRecordQueryData,
        loading: externalRoleRecordQueryLoading,
    }] = useLazyQuery<ExternalRoleCardGetExternalRoleRecordQuery>(ExternalRoleCardGetExternalRoleRecordDocument)

    const [lazyGetExternalServiceList, {
        data: externalServiceListQueryData,
        loading: externalServiceListLoadingData,
    }] = useLazyQuery<UserFormGetExternalServiceListForAutocompleteQuery>(UserFormGetExternalServiceListForAutocompleteDocument)

    const id = useMemo(() => searchParams.get('id'), [searchParams])

    useEffect(() => {
        if (id && edit) {
            lazyGetExternalRoleRecord({
                variables: {
                    input: {
                        id: id,
                    },
                } as ExternalRoleCardGetExternalRoleRecordQueryVariables,
            })
        }
    }, [id])

    useEffect(() => {
        lazyGetExternalServiceList()
    }, [])

    useEffect(() => {
        if (externalRoleRecordQueryData) {
            savedData.current = externalRoleRecordQueryData.externalRole.record
            reset({
                name: externalRoleRecordQueryData.externalRole.record.name,
                recognitionKey: externalRoleRecordQueryData.externalRole.record.recognitionKey,
                description: externalRoleRecordQueryData.externalRole.record.description,
                externalServiceId: externalRoleRecordQueryData.externalRole.record.externalService.id,
                default: externalRoleRecordQueryData.externalRole.record.default
            })
        }
    }, [externalRoleRecordQueryData])

    const savedData = useRef<ExternalRoleCardGetExternalRoleRecordQuery['externalRole']['record'] | null>(null)

    const update = (data: TExternalRoleUpdateInput) => {
        DEBUG && console.log('data UPDATE', data)
        DEBUG && console.log('data UPDATE initial', savedData.current)
        DEBUG && console.log('data UPDATE diff', updatedDiff(savedData.current!, data))
        updateExternalRoleMutation({
            variables: {
                input: {
                    id: id,
                    payload: updatedDiff(savedData.current!, data),
                },
            } as ExternalRoleFormUpdateExternalRoleMutationVariables,
        })
            .then((response) => {
                console.log('promise response', response)
                if (searchParams.get('from')) {
                    navigate(JSON.parse(searchParams.get('from')!))
                } else {
                    navigate('./../table')
                }
            })
    }

    const add = (data: TExternalRoleCreateInput) => {
        DEBUG && console.log('data ADD', data)
        createExternalRoleMutation({
            variables: {
                input: data,
            } as ExternalRoleFormCreateExternalRoleMutationVariables,
        })
            .then((response) => {
                console.log('promise response', response)
                if (searchParams.get('from')) {
                    navigate(JSON.parse(searchParams.get('from')!))
                } else {
                    navigate('./../table')
                }
            })
    }

    const onSubmit = (data: any) => {
        DEBUG && console.log('data BEFORE processing', data)
        data = extractIds(data)

        if (edit) {
            DEBUG && console.log('data AFTER processing', data)
            update(data)
        } else {
            DEBUG && console.log('data AFTER processing', data)
            add(data)
        }
    }

    useLayoutEffect(() => {
        setOnSubmitFunc({callback: onSubmit})
    }, [])

    const externalServicesData = useMemo(() => (
        externalServiceListQueryData?.externalService.list.data
            .map((item) => (
                {
                    id: item.id,
                    title: item.name,
                }
            ))
    ), [externalServiceListQueryData])

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
            {!externalRoleRecordQueryLoading && (
                <Box sx={{
                    width: '100%',
                    padding: theme.spacing(2),
                    boxSizing: 'border-box',
                    height: '100%',
                }}>
                    <AlexContentProvider pointConfig={[
                        {
                            name: 'mainFormExternalRole',
                            title: 'Основная информация',
                            body: (
                                <Grid container spacing={theme.spacing(2)}>
                                    <Grid item xs={12}>
                                        <AlexInputControlled name={'name'} required
                                                             label={'Название'}
                                                             error={Boolean(errors.name)}
                                                             errorText={errors.name?.message as string | undefined}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <AlexInputControlled name={'description'}
                                                             label={'Описание'}
                                                             multiline
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <AlexAutocompleteControlled name={'externalServiceId'}
                                                                    label={'Внешний сервис'}
                                                                    options={externalServicesData || []}
                                                                    error={Boolean(errors.name)}
                                                                    errorText={errors.name?.message as string | undefined}
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <AlexCheckBoxControlled name={'default'} size={30}
                                                                justifyContent={'start'}
                                                                label={'Стандартная роль'}
                                                                color={{
                                                                    outline: theme.palette.grey['800'],
                                                                    checked: theme.palette.primary.main,
                                                                }}/>
                                    </Grid>
                                </Grid>
                            ),
                        },
                        {
                            name: 'exchangeParamsFormExternalRole',
                            title: 'Параметры обмена',
                            body: (
                                <Grid container spacing={theme.spacing(2)}>
                                    <Grid item xs={12}>
                                        <AlexInputControlled name={'recognitionKey'} required
                                                             label={'Ключ распознавания'}
                                                             error={Boolean(errors.recognitionKey)}
                                                             errorText={errors.recognitionKey?.message as string | undefined}
                                        />
                                    </Grid>
                                </Grid>
                            ),
                        },
                    ]}/>
                </Box>
            )}
        </Box>
    )
}