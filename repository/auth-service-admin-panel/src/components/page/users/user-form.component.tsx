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
    UserFormGetExternalServiceListForAutocompleteDocument,
    UserFormGetExternalServiceListForAutocompleteQuery,
    UserFormGetExternalServiceListForChooseUserExternalRolesDocument,
    UserFormGetExternalServiceListForChooseUserExternalRolesQuery,
    UserFormUpdateUserDocument,
    UserFormUpdateUserMutation,
    UserFormUpdateUserMutationVariables,
    UsersTableGetUserListDocument,
} from '../../../types/graphql/graphql.ts'
import {EERoleToRusName} from '../../enum/erole-to-rus-name.enum.ts'
import {AlexContentProvider} from '../../../shared-react-components/alex-content/alex-content-provider.component.tsx'
import {validEmail, validPassword} from '../../../shared-react-components/form-utils/Regex/regex.ts'
import {AlexSelect} from '../../../shared-react-components/form-utils/AlexSelect/AlexSelect.tsx'
import {
    AlexAutocompleteControlled,
} from '../../../shared-react-components/form-utils/alex-autocomplete/alex-autocomplete-controlled.component.tsx'
import {alexDiff} from '../../function/alex-diff.function.ts'
import {
    ChooseUserExternalRoles, TChooseUserExternalRolesOptions, TChooseUserExternalRolesValue,
} from '../../widgets/choose-user-external-roles/choose-user-external-roles.component.tsx'

interface IUserFormProps {
    setOnSubmitFunc: React.Dispatch<React.SetStateAction<{ callback: ((data: any) => void) | null }>>
    edit: boolean
}

const DEBUG = true

export const UserForm: FC<IUserFormProps> = ({
                                                 setOnSubmitFunc,
                                                 edit,
                                             }) => {
    const {formState: {errors}, reset} = useFormContext()
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()

    const [updateUserMutation] = useMutation<UserFormUpdateUserMutation>(UserFormUpdateUserDocument, {
        refetchQueries: [
            {query: UsersTableGetUserListDocument},
        ],
    })

    const [createUserMutation] = useMutation<UserFormCreateUserMutation>(UserFormCreateUserDocument, {
        refetchQueries: [
            {query: UsersTableGetUserListDocument},
        ],
    })

    const [lazyGetUserRecord, {
        data: userRecordQueryData,
        loading: userRecordQueryLoading,
    }] = useLazyQuery<UserCardGetUserRecordQuery>(UserCardGetUserRecordDocument)

    const [lazyGetExternalServiceList, {
        data: externalServiceListQueryData,
        loading: externalServiceListLoadingData,
    }] = useLazyQuery<UserFormGetExternalServiceListForAutocompleteQuery>(UserFormGetExternalServiceListForAutocompleteDocument)

    const [lazyGetExternalServiceForChooseList, {
        data: externalServiceListForChooseQueryData,
        loading: externalServiceListForChooseLoadingData,
    }] = useLazyQuery<UserFormGetExternalServiceListForChooseUserExternalRolesQuery>(UserFormGetExternalServiceListForChooseUserExternalRolesDocument)

    const id = useMemo(() => searchParams.get('id'), [searchParams])

    useEffect(() => {
        if (id && edit) {
            lazyGetUserRecord({
                variables: {
                    input: {
                        id: id,
                    },
                } as UserCardGetUserRecordQueryVariables,
            })
        }
    }, [id])

    useEffect(() => {
        lazyGetExternalServiceList()
        lazyGetExternalServiceForChooseList()
    }, [])

    useEffect(() => {
        if (userRecordQueryData) {
            const refinedData = {
                email: userRecordQueryData.user.record.email,
                role: userRecordQueryData.user.record.role,
                externalRolesId: userRecordQueryData.user.record.externalRoles
                    .map((item) => item.id),
                externalServicesId: userRecordQueryData.user.record.externalServices
                    .map((item) => item.id),
                verified: userRecordQueryData.user.record.verified,
                password: undefined,
                userExternalRoles: userRecordQueryData.user.record.externalServices.map((item) => ({
                    externalServiceId: item.id,
                    externalRolesId: userRecordQueryData.user.record.externalRoles
                        .filter((_item) => _item.externalService.id === item.id)
                        .map((_item) => _item.id)
                })) as TChooseUserExternalRolesValue,
            }
            savedData.current = refinedData
            reset(refinedData)
        }
    }, [userRecordQueryData])

    const savedData = useRef<any>(null)

    const externalServicesData = useMemo(() => (
        externalServiceListQueryData?.externalService.list.data
            .map((item) => (
                {
                    id: item.id,
                    title: item.name,
                }
            ))
    ), [externalServiceListQueryData])

    const externalRolesOptions: TChooseUserExternalRolesOptions[] = useMemo(() => (
        externalServiceListForChooseQueryData?.externalService.list.data
            .map((item) => ({
                externalServiceId: item.id,
                externalRoles: item.externalRoles.map((item) => ({
                    id: item.id,
                    title: item.name,
                })) || [],
            })) || []
    ), [externalServiceListForChooseQueryData])

    const update = (data: TUserUpdatePayloadInput) => {
        DEBUG && console.log('data UPDATE', data)
        DEBUG && console.log('data UPDATE initial', savedData.current)
        DEBUG && console.log('data UPDATE diff', alexDiff(savedData.current!, data))
        updateUserMutation({
            variables: {
                input: {
                    id: id,
                    payload: alexDiff(savedData.current!, data),
                },
            } as UserFormUpdateUserMutationVariables,
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

    const add = (data: TUserCreateInput) => {
        DEBUG && console.log('data ADD', data)
        createUserMutation({
            variables: {
                input: data,
            } as UserFormCreateUserMutationVariables,
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
        data.externalRolesId = [].concat(
            ...data.userExternalRoles
                .map((item: any) => item.externalRolesId),
        )
        delete data.userExternalRoles

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

    return (
        <Box sx={{
            width: '100%',
            display: 'flex',
            flex: 1,
            overflowY: 'scroll',
        }}>
            {userRecordQueryLoading && (
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
            {!userRecordQueryLoading && (
                <Box sx={{
                    width: '100%',
                    padding: theme.spacing(2),
                    boxSizing: 'border-box',
                    height: '100%',
                }}>
                    <AlexContentProvider pointConfig={[
                        {
                            name: 'mainFormUser',
                            title: 'Основная информация',
                            body: (
                                <Grid container spacing={theme.spacing(2)}>
                                    <Grid item xs={6}>
                                        <AlexInputControlled name={'email'} required label={'Почта'}
                                                             inputType={EInputType.email}
                                                             error={Boolean(errors.email)}
                                                             autoFocus
                                                             errorText={errors.email?.message as string | undefined}
                                                             validateFunctions={{
                                                                 regex: (valueToCheck: string) => (validEmail.test(valueToCheck) || !valueToCheck?.length) || 'Некорректный формат почты',
                                                             }}/>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <AlexInputControlled name={'password'} required={!edit}
                                                             label={edit ? 'Сменить пароль' : 'Пароль'}
                                                             inputType={EInputType.password}
                                                             error={Boolean(errors.password)}
                                                             errorText={errors.password?.message as string | undefined}
                                                             validateFunctions={{
                                                                 regex: (valueToCheck: string) => (validPassword.test(valueToCheck) || !valueToCheck?.length) || '8 символов, заглавная и строчная буква',
                                                             }}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <AlexSelect name={'role'} required
                                                    error={Boolean(errors.role)}
                                                    label={'Роль сервиса авторизации'}
                                                    errorText={errors.role?.message as string | undefined}
                                                    options={
                                                        Object.values(ERole).map((item) => {
                                                            return {
                                                                id: item,
                                                                name: EERoleToRusName[item],
                                                            }
                                                        })
                                                    }/>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <AlexCheckBoxControlled name={'verified'} size={30}
                                                                justifyContent={'start'}
                                                                label={'Пользователь подтверждён'}
                                                                color={{
                                                                    outline: theme.palette.grey['800'],
                                                                    checked: theme.palette.primary.main,
                                                                }}/>
                                    </Grid>
                                </Grid>
                            ),
                        },
                        {
                            name: 'externalServicesFormUser',
                            title: 'Внешние сервисы',
                            body: (
                                <Grid container spacing={theme.spacing(2)}>
                                    <Grid item xs={12}>
                                        <AlexAutocompleteControlled name={'externalServicesId'} multiple
                                                                    label={'Внешние сервисы'}
                                                                    options={externalServicesData || []}/>
                                    </Grid>
                                </Grid>
                            ),
                        },
                        {
                            name: 'externalRolesFormUser',
                            title: 'Роли во внешних сервисах',
                            body: (<>
                                <ChooseUserExternalRoles name={'userExternalRoles'}
                                                         externalRolesOptions={externalRolesOptions}
                                                         externalServiceOptions={
                                                             userRecordQueryData?.user.record.externalServices.map((item) => ({
                                                                 id: item.id,
                                                                 title: item.name,
                                                             })) || []
                                                         }
                                />
                            </>),
                        },
                    ]}/>
                </Box>
            )}
        </Box>
    )
}