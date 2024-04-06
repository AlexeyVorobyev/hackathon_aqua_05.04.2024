import React, { FC } from 'react'
import { AlexRouter } from './shared-react-components/AlexRouter/AlexRouter.tsx'
import { routesList } from './components/router/routesList.tsx'
import { useLoginStatus } from './functions/useLoginStatus.tsx'


export const LoginShell: FC = () => {
    const loginStatus = useLoginStatus()

    return (<>
        {/*{loginStatus ? (*/}
        {/*    null*/}
        {/*) : (*/}
        {/*    <AlexRouter routesList={routesList}/>*/}
        {/*)}*/}
        <AlexRouter routesList={routesList}/>
    </>)
}