import React, { FC } from 'react'
import { routesListConfig } from './components/config/routes-list-config.data.tsx'
import { AlexRouter } from './shared-react-components/AlexRouter/AlexRouter.tsx'
import { SkeletonWrapper } from './components/skeleton/skeleton-wrapper.component.tsx'
import { useLoginStatus } from './components/hook/use-login-status.hook.tsx'
import { TokenProcessorPage } from './components/page/token-processor/token-processor-page.component.tsx'

export const LoginShell: FC = () => {
    const loginStatus = useLoginStatus()

    return (<>
        {loginStatus ? (
            <SkeletonWrapper>
                <AlexRouter routesList={routesListConfig}/>
            </SkeletonWrapper>
        ) : (
            <TokenProcessorPage/>
        )}
    </>)
}