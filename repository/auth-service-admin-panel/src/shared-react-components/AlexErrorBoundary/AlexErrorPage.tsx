import {FC} from "react";
import { Button, Stack, Typography, useTheme } from '@mui/material'
import { AlexLink } from '../AlexLink/AlexLink.tsx'

export const AlexErrorPage: FC = () => {
    const theme = useTheme()
    return (
        <Stack direction={'column'} justifyContent={'center'} alignItems={'center'} spacing={theme.spacing(2)}
               height={'100%'}>
            <Typography variant={'h3'}>На странице произошла какая-то ошибка :(</Typography>
            <Typography variant={'h4'}>Обратитесь к администратору</Typography>
            <AlexLink to={'/'}>
                <Button variant={'contained'} onClick={() => setTimeout(() => window.location.reload(),1)}>
                    <Typography variant={'button'}>Вернуться на главную</Typography>
                </Button>
            </AlexLink>
        </Stack>
    )
}