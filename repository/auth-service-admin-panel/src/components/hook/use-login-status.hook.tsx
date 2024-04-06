import { useCallback, useEffect, useState } from 'react'
import { useReactiveVar } from '@apollo/client'
import { userLogged } from '../../core/apollo/vars.ts'
import { getTokensAndExpiry } from '../function/auth-token-and-expiry.function.ts'

export const useLoginStatus = () => {
    const checkStatus = useCallback(() => {
        if (getTokensAndExpiry().refreshExpiry) {
            if (new Date(getTokensAndExpiry().refreshExpiry as string).getTime() < new Date().getTime()) {
                localStorage.clear()
                return false
            }
        }
        return (
            Boolean(getTokensAndExpiry().accessExpiry) || Boolean(getTokensAndExpiry().refreshToken)
        )
    }, [localStorage])

    const [loginStatus, setLoginStatus] = useState<boolean>(checkStatus())

    const userLoggedVar = useReactiveVar(userLogged)

    useEffect(() => {
        setLoginStatus(checkStatus())
    }, [userLoggedVar])

    return loginStatus
}

