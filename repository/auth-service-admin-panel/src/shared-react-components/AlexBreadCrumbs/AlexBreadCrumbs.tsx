import { FC, useCallback, useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import { Breadcrumbs, Typography, useTheme } from '@mui/material'
import { constructPathLink } from '../functions/constructPathLink.ts'
import { checkLocation } from '../functions/checkLocation.ts'
import { APP_NAME } from '../../globalConstants.ts'
import { AlexLink } from '../AlexLink/AlexLink.tsx'

interface IBreadCrumbConfig {
    linkTo: string,
    name: string
}

interface IAlexBreadCrumbs {
    nameMap: Map<string, string>
    allowedLinks: string[]
    forbiddenLinks?: string[]
}

export const AlexBreadCrumbs: FC<IAlexBreadCrumbs> = ({
                                                          nameMap,
                                                          allowedLinks,
                                                          forbiddenLinks = [],
                                                      }) => {
    const theme = useTheme()
    const location = useLocation()
    const pathArr = useMemo(() => location.pathname.split('/').filter((item) => item !== ''), [location])

    const constructBreadCrumbs = useCallback(() => {
        const breadCrumbsConfig: IBreadCrumbConfig[] = []

        for (let i = 1; i <= pathArr.length; i++) {
            const slicedArr = pathArr.slice(0, i)
            const name = slicedArr[slicedArr.length - 1]
            breadCrumbsConfig.push({
                name: nameMap.get(constructPathLink(slicedArr)) || name,
                linkTo: constructPathLink(slicedArr),
            })
        }

        return breadCrumbsConfig.map((item) => {
            const allowLink = !forbiddenLinks.includes(item.linkTo)
                && allowedLinks.includes(item.linkTo)
                && !checkLocation(location.pathname, item.linkTo)
            return (
                <AlexLink
                    tooltipTitle={'Перейти'}
                    key={item.linkTo}
                    to={allowLink ? item.linkTo : null}>
                    <Typography variant={'subtitle2'}
                                color={checkLocation(location.pathname, item.linkTo) ? theme.palette.secondary.main : allowLink ? '#000000' : '#777777'}
                                height={'24px'}>{item.name}</Typography>
                </AlexLink>
            )
        })
    }, [pathArr])

    return (
        <Breadcrumbs>
            <AlexLink
                to={'/'}
                tooltipTitle={'Перейти'}
                key={'/'}>
                <Typography variant={'subtitle2'}
                            color={checkLocation(location.pathname, '/') ? theme.palette.secondary.main : '#000000'}
                            height={'24px'}>{APP_NAME.toUpperCase()}</Typography>
            </AlexLink>
            {constructBreadCrumbs()}
        </Breadcrumbs>
    )
}