import React, {FC} from 'react'
import {FormProvider, useForm} from 'react-hook-form'
import {Button, Divider, Grid, Paper, Stack, Typography} from '@mui/material'
import {
    AlexInputControlled,
    EInputType,
} from '../../../shared-react-components/formUtils/AlexInput/AlexInputControlled.tsx'
import {validEmail, validPassword} from '../../../shared-react-components/formUtils/Regex/regex.ts'
import {theme} from '../../theme/theme.ts'
import {useSearchParams} from 'react-router-dom'
import {AlexLink} from '../../../shared-react-components/AlexLink/AlexLink.tsx'
import {
    RegistrationPageExternalServiceSignUpDocument,
    RegistrationPageExternalServiceSignUpMutation, RegistrationPageExternalServiceSignUpMutationVariables,
    RegistrationPageSignUpDocument,
    RegistrationPageSignUpMutation,
    RegistrationPageSignUpMutationVariables,
    TSignUpInput,
} from '../../../types/graphql/graphql.ts'
import {useMutation} from '@apollo/client'
import {EUrlAuthSearchParams} from '../../../common/enum/url-auth-search-params.ts'
import {toast} from 'react-toastify'
import {toastSettings} from '../../../shared-react-components/AlexToastProvider/AlexToastProvider.tsx'


type TFormData = { passwordCheck: string } & TSignUpInput

export const RegistrationPage: FC = () => {
    const methods = useForm<TFormData>()
    const {watch} = methods
    const passwordWatch = watch('password')
    const {handleSubmit, formState: {errors}} = methods
    const [searchParams] = useSearchParams()

    const [mutationBaseSignUp] = useMutation<RegistrationPageSignUpMutation>(RegistrationPageSignUpDocument, {
        fetchPolicy: 'network-only',
    })

    const [mutationExternalServiceSignUp] = useMutation<RegistrationPageExternalServiceSignUpMutation>(RegistrationPageExternalServiceSignUpDocument, {
        fetchPolicy: 'network-only',
    })

    const onSubmit = (data: TFormData) => {
        mutationBaseSignUp({
            variables: {
                input: {
                    email: data.email,
                    password: data.password,
                },
            } as RegistrationPageSignUpMutationVariables,
        })
            .then((response) => {
                if (!searchParams.get(EUrlAuthSearchParams.redirectUrl)) {
                    toast.error('redirectUrl not provided', toastSettings.connectionLost.properties)
                    return
                }
                if (response.data?.auth.baseSignUp) {
                    if (searchParams.get(EUrlAuthSearchParams.externalServiceRecognitionKey)) {
                        mutationExternalServiceSignUp({
                            context: {
                                headers: {
                                    authorization: `Bearer ${response.data.auth.baseSignUp.accessToken}`
                                }
                            },
                            variables: {
                                input: {
                                    recognitionKey: searchParams.get(EUrlAuthSearchParams.externalServiceRecognitionKey)
                                }
                            } as RegistrationPageExternalServiceSignUpMutationVariables
                        }).then((response) => {
                            if (response.data?.auth.externalServiceSignUp) {
                                const tokenData = response.data?.auth.externalServiceSignUp
                                const redirectUrl = new URL(decodeURI(searchParams.get(EUrlAuthSearchParams.redirectUrl)!))
                                redirectUrl.searchParams.set(EUrlAuthSearchParams.accessToken, tokenData?.accessToken)
                                redirectUrl.searchParams.set(EUrlAuthSearchParams.refreshToken, tokenData?.refreshToken)
                                redirectUrl.searchParams.set(EUrlAuthSearchParams.accessTokenTtl, tokenData?.accessTokenTTL)
                                redirectUrl.searchParams.set(EUrlAuthSearchParams.refreshTokenTtl, tokenData?.refreshTokenTTL)
                                window.location.replace(redirectUrl)
                            }
                        })
                    }
                    else {
                        const tokenData = response.data?.auth.baseSignUp
                        const redirectUrl = new URL(decodeURI(searchParams.get(EUrlAuthSearchParams.redirectUrl)!))
                        redirectUrl.searchParams.set(EUrlAuthSearchParams.accessToken, tokenData?.accessToken)
                        redirectUrl.searchParams.set(EUrlAuthSearchParams.refreshToken, tokenData?.refreshToken)
                        redirectUrl.searchParams.set(EUrlAuthSearchParams.accessTokenTtl, tokenData?.accessTokenTTL)
                        redirectUrl.searchParams.set(EUrlAuthSearchParams.refreshTokenTtl, tokenData?.refreshTokenTTL)
                        window.location.replace(redirectUrl)
                    }
                }
            })
    }

    return (
        <Grid container justifyContent={'center'} alignItems={'center'} height={'100vh'}>
            <Grid item width={'400px'}>
                <Paper
                    elevation={3}
                    sx={{
                        padding: 3,
                    }}
                >
                    <FormProvider {...methods} >
                        <Stack direction={'column'} justifyContent={'center'} spacing={theme.spacing(2)}>
                            <Stack direction={'column'} justifyContent={'center'} spacing={theme.spacing(2)}>
                                <AlexInputControlled name={'email'} required label={'Почта'}
                                                     inputType={EInputType.email}
                                                     error={Boolean(errors.email)}
                                                     autoFocus
                                                     errorText={errors.email?.message as string | undefined}
                                                     validateFunctions={{
                                                         regex: (valueToCheck: string) => (validEmail.test(valueToCheck)) || 'Некорректный формат почты',
                                                     }}
                                />

                                <AlexInputControlled name={'password'} required label={'Пароль'} hidden
                                                     inputType={EInputType.password}
                                                     error={Boolean(errors.password)}
                                                     errorText={errors.password?.message as string | undefined}
                                                     validateFunctions={{
                                                         regex: (valueToCheck: string) => (validPassword.test(valueToCheck)) || '8 символов, заглавная и строчная буква',
                                                     }}
                                />

                                <AlexInputControlled name={'passwordCheck'} required
                                                     label={'Повторите пароль'} hidden
                                                     inputType={EInputType.password}
                                                     validateFunctions={{
                                                         passwordCheck: (valueToCheck: string) => (valueToCheck === passwordWatch) || 'Пароли не совпадают',
                                                         regex: (valueToCheck: string) => (validPassword.test(valueToCheck)) || 'Пароль должен содержать 8 символов, заглавную и строчную букву',
                                                     }}
                                                     error={Boolean(errors.passwordCheck)}
                                                     errorText={errors.passwordCheck?.message as string | undefined}/>

                                <Button size={'large'} variant="contained"
                                        onClick={handleSubmit(onSubmit)}>ЗАРЕГИСТРИРОВАТЬСЯ</Button>
                            </Stack>
                            <Divider orientation={'horizontal'} variant={'middle'}>
                                <Typography variant={'subtitle1'} textAlign={'center'}>ИЛИ</Typography>
                            </Divider>
                            <Stack justifyContent={'center'}>
                                <Typography variant={'subtitle1'} textAlign={'center'}>
                                    Есть аккаунт? <AlexLink
                                    saveSearchParams
                                    to={'/'} sx={{
                                    textDecoration: 'none',
                                    color: theme.palette.primary.main,
                                }}>Авторизуйтесь</AlexLink></Typography>
                            </Stack>
                        </Stack>
                    </FormProvider>
                </Paper>
            </Grid>
        </Grid>
    )
}
