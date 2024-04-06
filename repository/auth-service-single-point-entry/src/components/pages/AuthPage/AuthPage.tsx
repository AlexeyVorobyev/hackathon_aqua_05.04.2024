import React, { FC } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { Button, Divider, Grid, Paper, Stack, Typography } from '@mui/material'
import {
    AlexInputControlled,
    EInputType,
} from '../../../shared-react-components/formUtils/AlexInput/AlexInputControlled.tsx'
import { theme } from '../../theme/theme.ts'
import { AlexLink } from '../../../shared-react-components/AlexLink/AlexLink.tsx'
import { AuthPageSignInDocument, AuthPageSignInQuery, TSignInInput } from '../../../types/graphql/graphql.ts'
import { useLazyQuery } from '@apollo/client'
import { useSearchParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { toastSettings } from '../../../shared-react-components/AlexToastProvider/AlexToastProvider.tsx'
import { EUrlAuthSearchParams } from '../../../common/enum/url-auth-search-params.ts'

export const AuthPage: FC = () => {
    const methods = useForm<TSignInInput>()
    const { handleSubmit, formState: { errors } } = methods
    const [searchParams] = useSearchParams()

    const [lazySignIn] = useLazyQuery<AuthPageSignInQuery>(AuthPageSignInDocument, {
        fetchPolicy: 'network-only',
        nextFetchPolicy: 'network-only',
    })

    const onSubmit = (data: TSignInInput) => {
        lazySignIn({ variables: { input: data } })
            .then((response) => {
                if (!searchParams.get(EUrlAuthSearchParams.redirectUrl)) {
                    toast.error('redirectUrl not provided', toastSettings.connectionLost.properties)
                    return
                }
                if (response.data?.auth.signIn) {
                    const tokenData = response.data?.auth.signIn
                    console.log(decodeURI(searchParams.get(EUrlAuthSearchParams.redirectUrl)!))
                    const redirectUrl = new URL(decodeURI(searchParams.get(EUrlAuthSearchParams.redirectUrl)!))
                    redirectUrl.searchParams.set(EUrlAuthSearchParams.accessToken, tokenData?.accessToken)
                    redirectUrl.searchParams.set(EUrlAuthSearchParams.refreshToken, tokenData?.refreshToken)
                    redirectUrl.searchParams.set(EUrlAuthSearchParams.accessTokenTtl, tokenData?.accessTokenTTL)
                    redirectUrl.searchParams.set(EUrlAuthSearchParams.refreshTokenTtl, tokenData?.refreshTokenTTL)
                    console.log(redirectUrl)
                    window.location.replace(redirectUrl)
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
                        <Stack spacing={theme.spacing(2)}>
                            <Stack direction={'column'} justifyContent={'center'} spacing={theme.spacing(2)}>
                                <AlexInputControlled name={'email'} required label={'Почта'}
                                                     inputType={EInputType.email}
                                                     error={Boolean(errors.email)}
                                                     autoFocus
                                                     errorText={errors.email?.message as string | undefined}/>

                                <AlexInputControlled name={'password'} required label={'Пароль'} hidden
                                                     inputType={EInputType.password}
                                                     error={Boolean(errors.password)}
                                                     errorText={errors.password?.message as string | undefined}/>

                                <Button size={'large'} variant="contained"
                                        onClick={handleSubmit(onSubmit)}>ВОЙТИ</Button>
                            </Stack>
                            <Divider orientation={'horizontal'} variant={'middle'}>
                                <Typography variant={'subtitle1'} textAlign={'center'}>ИЛИ</Typography>
                            </Divider>
                            <Stack justifyContent={'center'}>
                                <Typography variant={'subtitle1'} textAlign={'center'}>
                                    Нет аккаунта? <AlexLink
                                    saveSearchParams
                                    to={'../registration'} sx={{
                                    textDecoration: 'none',
                                    color: theme.palette.primary.main,
                                }}>Зарегестрируйтесь</AlexLink></Typography>
                            </Stack>
                        </Stack>
                    </FormProvider>
                </Paper>
            </Grid>
        </Grid>
    )
}
