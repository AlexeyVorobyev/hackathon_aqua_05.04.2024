import React, { FC, ReactNode, useLayoutEffect, useState } from 'react'
import { TableSortLabel, Tooltip } from '@mui/material'
import { TCustomDataTableColumn } from './alex-data-table.component.tsx'

enum ESortType {
    asc = 'asc',
    desc = 'desc'
}

interface IAlexDataTableSortWrapperProps {
    column: TCustomDataTableColumn
    children: ReactNode
    serverSideOptions: Map<string, any>
    setServerSideOptions: React.Dispatch<React.SetStateAction<Map<string, any>>>
}

export const AlexDataTableSortWrapper: FC<IAlexDataTableSortWrapperProps> = ({
                                                         column,
                                                         children,
                                                         serverSideOptions,
                                                         setServerSideOptions,
                                                     }) => {

    const [
        sortState,
        setSortState,
    ] = useState<ESortType | null>(
        serverSideOptions.get('sort')?.get(column.id) || null,
    )

    useLayoutEffect(() => {
        if (serverSideOptions.get('sort')?.get(column.id) === sortState) {
            return
        }

        if (!sortState) {
            if (!serverSideOptions.get('sort')) {
                return
            }

            if (!serverSideOptions.get('sort')?.get(column.id)) {
                return
            }

            setServerSideOptions((prev) => {
                const sortMap: Map<string, ESortType> = prev.get('sort')
                sortMap.delete(column.id)

                if (Array.from(sortMap.entries()).length) {
                    prev.set('sort', sortMap)
                } else {
                    prev.delete('sort')
                }

                return new Map(prev)
            })

            return
        }

        if (!serverSideOptions.get('sort')) {
            setServerSideOptions((prev) => {
                prev.set('sort', new Map([[column.id, sortState]]))
                return new Map(prev)
            })

            return
        }

        setServerSideOptions((prev) => {
            const sortMap: Map<string, ESortType> = prev.get('sort')
            sortMap.set(column.id, sortState as ESortType)
            prev.set('sort', sortMap)
            return new Map(prev)
        })
    }, [sortState])

    const handleOnClick = () => {
        setSortState((prev) => {
            if (!prev) {
                return ESortType.asc
            }

            if (prev === ESortType.desc) {
                return prev === 'desc'
                    ? null
                    : ESortType.asc
            }

            return ESortType.desc
        })
    }


    return (
        <Tooltip title={'Сортировка'}>
            <TableSortLabel direction={sortState || undefined}
                            active={Boolean(sortState)}
                            onClick={handleOnClick}>
                {children}
            </TableSortLabel>
        </Tooltip>
    )
}
