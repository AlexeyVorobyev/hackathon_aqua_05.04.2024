import {FC} from 'react'
import {useNavigate, useSearchParams} from 'react-router-dom'
import {GLOBAL_CONFIG} from '../../../globalConfig.ts'
import {userLogged} from '../../../core/apollo/vars.ts'

export enum ETokenProcessorPageSearchParams {
    accessToken = 'accessToken',
    refreshToken = 'refreshToken',
    accessTokenTtl = 'accessTokenTtl',
    refreshTokenTtl = 'refreshTokenTtl'
}

export const TokenProcessorPage: FC = () => {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()

    if (
        searchParams.has(ETokenProcessorPageSearchParams.accessToken)
        || searchParams.has(ETokenProcessorPageSearchParams.refreshToken)
    ) {
        localStorage.setItem('accessToken', searchParams.get(ETokenProcessorPageSearchParams.accessToken) || '')
        localStorage.setItem('refreshToken', searchParams.get(ETokenProcessorPageSearchParams.refreshToken) || '')
        localStorage.setItem('accessExpiry', searchParams.get(ETokenProcessorPageSearchParams.accessTokenTtl) || '')
        localStorage.setItem('refreshExpiry', searchParams.get(ETokenProcessorPageSearchParams.refreshTokenTtl) || '')
        userLogged(true)
        setTimeout(() => {
            navigate('/')
        },100)
    } else {
        const url = new URL(GLOBAL_CONFIG.entrypointServiceNginxAddress)
        url.searchParams.set('redirectUrl', `${window.location.protocol}//${window.location.host}`)
        window.location.replace(url)
    }

    return null
}