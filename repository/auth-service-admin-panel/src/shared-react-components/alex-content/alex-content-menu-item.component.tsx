import { FC } from 'react'
import { Box, Link, Typography } from '@mui/material'

export type TAlexContentMenuItemConfig = {
    name: string
    title: string
}

interface IAlexContentMenuItemProps {
    paperHovered: string | null,
    config: TAlexContentMenuItemConfig
}

export const AlexContentMenuItem: FC<IAlexContentMenuItemProps> = ({
                                                                       paperHovered,
                                                                       config,
                                                                   }) => (
    <Box key={config.name}
         style={{
             backgroundColor: (config.name) === paperHovered ? 'white' : '',
             padding: '8px 12px',
             fontSize: 16,
             borderRadius: 4,
         }}>
        <Typography>
            <Link href={`#${config.name}`} underline="none"
                  style={{ color: 'black' }}>
                {config.title}
            </Link>
        </Typography>
    </Box>
)