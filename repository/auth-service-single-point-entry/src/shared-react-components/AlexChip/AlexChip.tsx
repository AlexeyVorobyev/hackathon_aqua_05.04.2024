import { FC } from 'react'
import { Chip, ChipProps } from '@mui/material'

const invertHex = (hex: string) => {
    return (Number(`0x1${hex}`) ^ 0xFFFFFF).toString(16).toUpperCase()
}

interface IAlexChipProps extends Omit<ChipProps, 'color'> {
    color?: string
}

/**
 * Component that changes the underlying color behavior of the wrapped component
 *
 * @param color - Custom color for background and color of text that automatically matches the color
 * @param props - Default props of MUI Chip
 * */
export const AlexChip: FC<IAlexChipProps> = ({
                                                 color = '#333333',
                                                 ...props
                                             }) => (
    <Chip
        {...props}
        sx={{
            backgroundColor: color,
            color: `#${invertHex(color)}`,
        }}/>
)