import React, {FC} from "react"
import { Box, CircularProgress, Grid, IconButton, Stack, Typography, useTheme } from '@mui/material'
import {AlexBigCalendarHeaders} from "./AlexBigCalendarHeaders.tsx"
import {AlexBigCalendarFiller} from "./AlexBigCalendarFiller.tsx"
import {MAP_NUMBER_TO_MONTH_RUS} from "./AlexBigCalendarGlobaConstants.ts"
import {AlexIcon} from "../alex-icon/alex-icon.component.tsx"

export type TTagEntity = {
	tagId: number,
	tagName: string,
	tagDesc: string,
	tagColor: string
}

export type TAlexBigCalendarData = {
	id:string,
	date?: Date,
	name: string,
	tags?: TTagEntity[]
}

export type TServerSideOptions = Map<string, any>

interface IProps {
	data?: TAlexBigCalendarData[]
	serverSideOptions?: TServerSideOptions,
	setServerSideOptions?: React.Dispatch<React.SetStateAction<TServerSideOptions>>
}

export const AlexBigCalendar: FC<IProps> = ({
												data,
												serverSideOptions,
												setServerSideOptions
											}) => {
	const theme = useTheme()

	return (<>
		{!data && (<Box sx={{
			width: '100%',
			height: '100%',
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center'
		}}>
			<CircularProgress/>
		</Box>)}
		{data && (<Box sx={{
			width: '100%',
			height: '100%',
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			background: theme.palette.secondary.main
		}}>
			<Stack direction={'column'} justifyContent={'space-between'} height={'100%'}>
				<Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
					<Stack direction={'row'} padding={theme.spacing(2)} alignItems={'center'}
						   spacing={theme.spacing(2)}>
						<Typography variant={'h6'} color={'white'}>
							Месяц: {serverSideOptions?.get('date') && MAP_NUMBER_TO_MONTH_RUS.get(new Date(serverSideOptions?.get('date')).getMonth())}
						</Typography>
						<Typography variant={'h6'} color={'white'}>
							Год: {serverSideOptions?.get('date') && new Date(serverSideOptions?.get('date')).getFullYear()}
						</Typography>
					</Stack>
					<Stack direction={'row'} padding={theme.spacing(2)} alignItems={'center'}
						   spacing={theme.spacing(2)}>
						<Stack justifyContent={'center'} alignItems={'center'} bgcolor={'white'} borderRadius={'100px'}>
							<IconButton color={'primary'} size={'small'} onClick={() => {
								setServerSideOptions?.((prev: TServerSideOptions) => {
									const actualDate = new Date(serverSideOptions?.get('date'))
									prev.set('date', new Date(actualDate.getFullYear(), actualDate.getMonth() - 1, actualDate.getDate()))
									return new Map(prev)
								})
							}}>
								<AlexIcon iconName={'keyBoardArrowLeft'} fontSize={'large'}/>
							</IconButton>
						</Stack>
						<Stack justifyContent={'center'} alignItems={'center'} bgcolor={'white'} borderRadius={'100px'}>
							<IconButton color={'primary'} size={'small'} onClick={() => {
								setServerSideOptions?.((prev: TServerSideOptions) => {
									const actualDate = new Date(serverSideOptions?.get('date'))
									prev.set('date', new Date(actualDate.getFullYear(), actualDate.getMonth() + 1, actualDate.getDate()))
									return new Map(prev)
								})
							}}>
								<AlexIcon iconName={'keyBoardArrowRight'} fontSize={'large'}/>
							</IconButton>
						</Stack>
					</Stack>
				</Stack>
				<Grid rowGap={'4px'} columnSpacing={'4px'} container flex={1}
					  sx={{background: theme.palette.secondary.main}}>
					<AlexBigCalendarHeaders/>
					<AlexBigCalendarFiller serverSideOptions={serverSideOptions} setServerSideOptions={setServerSideOptions} data={data}/>
				</Grid>
			</Stack>
		</Box>)}
	</>)
}