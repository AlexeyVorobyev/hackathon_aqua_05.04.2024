import React, { FC, useMemo, useState } from 'react'
import { IconButton, Popover, Tooltip } from '@mui/material'
import TuneIcon from '@mui/icons-material/Tune'
import { AlexFiltersFormContext } from './AlexFiltersFormContext'
import { AlexFilter, IAlexFilter } from './AlexFilter'

interface IProps {
    filterListIds: (string | [string, string])[]
    serverSideOptions: Map<string, any>
    setServerSideOptions: React.Dispatch<React.SetStateAction<Map<string, any>>>
    filtersMap: Map<string, IAlexFilter>
}

const DEBUG = true
const DEBUG_PREFIX = 'ALEX_FILTERS'

export const AlexFilters: FC<IProps> = ({
                                            filterListIds,
                                            serverSideOptions,
                                            setServerSideOptions,
                                            filtersMap,
                                        }) => {
    DEBUG && console.log(DEBUG_PREFIX, 'filterListIds', filterListIds)
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)

    const renamedIds = useMemo(() => filterListIds.map((item) => Array.isArray(item) ? item[1] : item),[filterListIds])
    const initialIds = useMemo(() => filterListIds.map((item) => Array.isArray(item) ? item[0] : item),[filterListIds])

    return (<>
        <Tooltip title={'Фильтры'}>
            <IconButton onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                setAnchorEl(event.currentTarget)
            }}>
                <TuneIcon color={'secondary'}/>
            </IconButton>
        </Tooltip>
        <Popover
            open={Boolean(anchorEl)}
            anchorEl={anchorEl}
            onClose={() => setAnchorEl(null)}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
            }}
        >
            <AlexFiltersFormContext setAnchorEl={setAnchorEl} setServerSideOptions={setServerSideOptions}
                                    serverSideOptions={serverSideOptions} filterListIds={renamedIds}>
                {initialIds.map((id, index) => {
                    const config = filtersMap.get(id)
                    if (config) {
                        return <AlexFilter config={config} id={renamedIds[index]} key={renamedIds[index]}/>
                    } else {
                        return `Некорректный id фильтра ${id}`
                    }
                })}
            </AlexFiltersFormContext>
        </Popover>
    </>)
}