import { useSearchParams } from 'react-router-dom'
import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react'
import { replacer } from './json-functions/replacer.ts'
import { reviver } from './json-functions/reviver.ts'

export enum EUsePageStateMode {
    queryString = 'QUERY_STRING',
    sessionStorage = 'SESSION_STORAGE',
    localStorage = 'LOCAL_STORAGE',
}

export type TStoredOptions = Map<string, any>

type TUseAlexPageStateReturn = {
    variables: Record<string, any>
    storedOptions: TStoredOptions
    setStoredOptions: React.Dispatch<React.SetStateAction<TStoredOptions>>
}

interface IUseAlexPageStateProps {
    varsBehaviorMap?: (params: Record<string, any>) => Record<string, any>
    modeRead?: EUsePageStateMode[],
    modeWrite?: EUsePageStateMode[],
    storageKey?: string
    defaultValue?: TStoredOptions
}

const DEBUG = true

/**
 *  React hook, which provides functionality of saving data to various storages (localStorage, sessionStorage, query)
 *
 *  @param varsBehaviorMap - Function, mapper converts returned variables
 *  @param modeRead - Array of storages to read in priority
 *  @param modeWrite - Array of storages to write in priority
 *  @param storageKey - key to recognise stored value in sessionStorage and localStorage
 *  @param defaultValue - default values
 *
 *  @return variables - Processed storedOptions in object
 *  @return storedOptions
 *  @return setStoredOptions
 * */
export const useAlexPageState = ({
                                     varsBehaviorMap,
                                     modeRead = [],
                                     modeWrite = [],
                                     storageKey = 'pageState',
                                     defaultValue = new Map<string, any>([]),
                                 }: IUseAlexPageStateProps): TUseAlexPageStateReturn => {
    const [searchParams, setSearchParams] = useSearchParams()

    const initialSetStoredOptions = useCallback((modeList: EUsePageStateMode[]) => {
        let mode: EUsePageStateMode | undefined = undefined

        for (const item of modeList) {
            if (item === EUsePageStateMode.sessionStorage || item === EUsePageStateMode.localStorage) {
                const stringValue = item === EUsePageStateMode.sessionStorage
                    ? sessionStorage.getItem(storageKey)
                    : localStorage.getItem(storageKey)
                if (stringValue) {
                    mode = item
                    break
                }
            } else if (item === EUsePageStateMode.queryString) {
                if (Array.from(searchParams.entries()).length) {
                    mode = item
                    break
                }
            }
        }

        if (mode === EUsePageStateMode.queryString) {
            const queryStringState = new Map(
                Array.from(searchParams.entries())
                    .map((param) => [param[0], JSON.parse(param[1], reviver)]),
            )
            return new Map([...defaultValue, ...queryStringState]) as TStoredOptions
        } else if (mode === EUsePageStateMode.sessionStorage || mode === EUsePageStateMode.localStorage) {
            const stringValue = mode === EUsePageStateMode.sessionStorage
                ? sessionStorage.getItem(storageKey)
                : localStorage.getItem(storageKey)
            return stringValue
                ? new Map([...defaultValue, ...JSON.parse(stringValue, reviver)]) as TStoredOptions
                : defaultValue
        } else {
            return defaultValue
        }
    }, [modeRead, defaultValue, localStorage, sessionStorage, storageKey])

    // синхронизация состояний storage -> storedOptions при моунте
    const [storedOptions, setStoredOptions] = useState<TStoredOptions>(initialSetStoredOptions(modeRead)!)

    const [processedParams, setProcessedParams] = useState<Record<string, any>>(
        varsBehaviorMap
            ? varsBehaviorMap(Object.fromEntries(storedOptions)) || null
            : Object.fromEntries(storedOptions) || null)

    // синхронизация состояний storedOptions -> storage
    useLayoutEffect(() => {
        DEBUG && console.debug('current storedOptions state', storedOptions, storageKey)
        if (modeWrite?.includes(EUsePageStateMode.queryString)) {
            setSearchParams(new URLSearchParams(
                Array.from(storedOptions)
                    .map((param) => [param[0], JSON.stringify(param[1], replacer)]),
            ))
        }
        if (modeWrite?.includes(EUsePageStateMode.sessionStorage)) {
            sessionStorage.setItem(storageKey, JSON.stringify(storedOptions, replacer))
        }
        if (modeWrite?.includes(EUsePageStateMode.localStorage)) {
            localStorage.setItem(storageKey, JSON.stringify(storedOptions, replacer))
        }
    }, [storedOptions])

    useEffect(() => {
        if (varsBehaviorMap) {
            setProcessedParams(varsBehaviorMap(Object.fromEntries(storedOptions)))
        } else {
            setProcessedParams(Object.fromEntries(storedOptions))
        }
    }, [storedOptions])

    return {
        variables: processedParams,
        storedOptions: storedOptions,
        setStoredOptions: setStoredOptions,
    }
}