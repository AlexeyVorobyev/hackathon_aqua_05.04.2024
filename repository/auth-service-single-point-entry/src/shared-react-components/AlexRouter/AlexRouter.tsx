import { FC, ReactNode, useCallback } from 'react'
import { Route, Routes } from 'react-router-dom'

export type TRoute = {
    path: string,
    name: string
    component: ReactNode
    routes?: TRoute[]
}

interface IAlexRouterProps {
    routesList: TRoute[]
}

export const AlexRouter: FC<IAlexRouterProps> = ({ routesList }) => {

    const constructRoutes = useCallback((routesList: TRoute[]) => {
        return routesList.map((item) => {
            return (
                <Route path={item.path} element={item.component} key={item.path}>
                    {item.routes && constructRoutes(item.routes)}
                </Route>
            )
        })
    }, [routesList])

    return (
        <Routes>
            {constructRoutes(routesList)}
        </Routes>
    )
}