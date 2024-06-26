import React, { FC, useMemo } from 'react'
import { Chip, Divider, Stack, Typography, useTheme } from '@mui/material'
import { AlexDataTableSimpleFilter } from './AlexDataTableSimpleFilter'
import { AlexDataTableColumnsSelect } from './AlexDataTableColumnsSelect'
import { AlexFilters } from '../AlexFilters/AlexFilters'
import { AlexDataTableDownloadCSV } from './AlexDataTableDownloadCSV'
import { IAlexFilter } from '../AlexFilters/AlexFilter.tsx'
import { TCustomDataTableColumn } from './alex-data-table.component.tsx'

interface IProps {
    simpleFilter: boolean
    columnsSelect: boolean
    columnsState: TCustomDataTableColumn[]
    setColumnsState: React.Dispatch<React.SetStateAction<TCustomDataTableColumn[]>>,
    filterListIds?: string[]
    serverSideOptions: Map<string, any>
    setServerSideOptions: React.Dispatch<React.SetStateAction<Map<string, any>>>
    downloadCSV: boolean
    data?: Object[]
    columns: TCustomDataTableColumn[]
    filtersMap: Map<string, IAlexFilter>
}

export const AlexDataTableHeader: FC<IProps> = ({
                                                    columns,
                                                    simpleFilter,
                                                    columnsState,
                                                    columnsSelect,
                                                    setColumnsState,
                                                    filterListIds,
                                                    serverSideOptions,
                                                    setServerSideOptions,
                                                    downloadCSV,
                                                    data,
                                                    filtersMap,
                                                }) => {
    const theme = useTheme()
    const amountOfChosenFilters = useMemo(() => {
        if (!filterListIds) return 0
        return Array.from(serverSideOptions)
            .filter((param) => [...filterListIds, 'simpleFilter'].includes(param[0])).length
    }, [serverSideOptions, filterListIds])

    return (<>
        <Stack direction={'row'} justifyContent={'end'} spacing={theme.spacing(2)}
               padding={theme.spacing(2)} useFlexGap alignItems={'center'}>
            <Stack direction={'row'} spacing={theme.spacing(2)} alignItems={'center'} sx={{ marginRight: 'auto' }}>
                {simpleFilter &&
                    <AlexDataTableSimpleFilter setServerSideOptions={setServerSideOptions}
                                               serverSideOptions={serverSideOptions}/>}
                {amountOfChosenFilters
                    ? <Chip label={<Typography variant={'body1'}>
                        Применённые фильтры: {amountOfChosenFilters}</Typography>}/>
                    : undefined}
            </Stack>
            {filterListIds &&
                <AlexFilters filterListIds={filterListIds} setServerSideOptions={setServerSideOptions}
                             serverSideOptions={serverSideOptions} filtersMap={filtersMap}/>}
            {downloadCSV && <AlexDataTableDownloadCSV columnsState={columnsState} data={data} columns={columns}/>}
            {columnsSelect &&
                <AlexDataTableColumnsSelect columnsState={columnsState} setColumnsState={setColumnsState}/>}
        </Stack>
        <Divider/>
    </>)
}