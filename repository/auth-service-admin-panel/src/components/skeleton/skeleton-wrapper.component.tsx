import {FC, ReactNode} from "react";
import {Box, Stack, Typography} from "@mui/material";
import {AlexSideNavigation} from "../../shared-react-components/AlexSideNavigation/AlexSideNavigation.tsx";
import {theme} from "../theme/theme";
import {AlexErrorBoundary} from "../../shared-react-components/AlexErrorBoundary/AlexErrorBoundary.tsx";
import {APP_NAME} from "../../globalConstants.ts"
import { AlexUserPanel } from '../../shared-react-components/AlexUserPanel/AlexUserPanel.tsx'
import { PageWrapper } from './page-wrapper.component.tsx'
import { sideNavigationConfig } from '../config/side-navigation-config.data.tsx'

interface IProps {
    children:ReactNode
}

export const SkeletonWrapper:FC<IProps> = ({children}) => {
    return (
        <Box width={'100%'} height={'100%'}>
            <Box height={'70px'} sx={{
                background:theme.palette.primary.main,
                boxSizing:'border-box',
                padding:theme.spacing(2),
                boxShadow: 2
            }}>
                <Stack alignItems={'center'} direction={'row'} height={'100%'} justifyContent={'space-between'}>
                    <Typography variant={'h3'} color={theme.palette.primary.contrastText}>{APP_NAME.toUpperCase()}</Typography>
                    <AlexUserPanel/>
                </Stack>
            </Box>
            <Stack height={'calc(100vh - 70px)'} width={'100%'} direction={'row'}>
                <AlexSideNavigation config={sideNavigationConfig}/>
                <Box sx={{flex:'1', height:'100%',width:'0'}}>
                    <PageWrapper>
                        <AlexErrorBoundary>
                            {children}
                        </AlexErrorBoundary>
                    </PageWrapper>
                </Box>
            </Stack>
        </Box>
    )
}

