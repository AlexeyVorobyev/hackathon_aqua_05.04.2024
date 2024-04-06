import React, { FC } from 'react'
import { EIconToNameMap, IconToNameMap } from './alex-icon-icon-to-name-map.data.ts'
import { SvgIconProps } from '@mui/material'

interface IAlexIconProps extends SvgIconProps {
    iconName: EIconToNameMap | `${EIconToNameMap}`
}

/**
 *  Component that loads predefined mui icons by enum
 *
 *  @param iconName - Predefined icon name
 *  @param props - Default props of MUI SVG icon
 * */
export const AlexIcon: FC<IAlexIconProps> = ({
                                                 iconName,
                                                 ...props
                                             }) => {
    const Icon = IconToNameMap[iconName]
    return (
        <Icon {...props}/>
    )
}