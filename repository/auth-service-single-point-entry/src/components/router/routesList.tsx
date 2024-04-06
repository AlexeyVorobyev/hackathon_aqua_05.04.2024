import { AuthPage } from '../pages/AuthPage/AuthPage'
import { Navigate } from 'react-router-dom'
import { RegistrationPage } from '../pages/RegistrationPage/RegistrationPage.tsx'
import { TRoute } from '../../shared-react-components/AlexRouter/AlexRouter.tsx'

export const routesList: TRoute[] = [
    {
        path: '/',
        name: 'Страница авторизации',
        component: <AuthPage/>,
    },

    {
        path: '/registration',
        name: 'Страница регистрации',
        component: <RegistrationPage/>,
    },

    {
        path: '*',
        name: 'Пересылка',
        component: <Navigate to={'/'}/>,
    },
]