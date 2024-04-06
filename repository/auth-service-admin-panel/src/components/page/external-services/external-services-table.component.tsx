import { FC, useEffect } from 'react'
import {
    AlexDataTable,
    EActionDeleteType,
} from '../../../shared-react-components/alex-data-table/alex-data-table.component.tsx'
import { alexFiltersMap } from '../../config/alex-filters-map.data.tsx'
import { PER_PAGE_OPTIONS } from '../../../globalConstants.ts'
import { ExternalServicesTableColumns } from './columns.data.tsx'
import { useLazyQuery, useMutation } from '@apollo/client'
import {
    ExternalServicesTableDeleteExternalServiceByIdDocument,
    ExternalServicesTableDeleteExternalServiceByIdMutation,
    ExternalServicesTableGetExternalServiceListDocument,
    ExternalServicesTableGetExternalServiceListQuery,
    ExternalServicesTableGetExternalServiceListQueryVariables,
} from '../../../types/graphql/graphql.ts'
import {
    EUsePageStateMode,
    useAlexPageState,
} from '../../../shared-react-components/functions/useAlexPageState/useAlexPageState.tsx'
import { useLocation } from 'react-router-dom'
import { varsBehaviourMapExternalServices } from './vars-behaviour-map-external-services.adapter.ts'
import { EPageType } from '../customization/customization-page.component.tsx'

enum EExternalServicesTableStoredParams {
    page = 'page',
    perPage = 'perPage'
}

export const ExternalServicesTable: FC = () => {
    const [lazyGetExternalServiceListQuery, {
        data: externalServiceListQueryData,
    }] = useLazyQuery<ExternalServicesTableGetExternalServiceListQuery>(ExternalServicesTableGetExternalServiceListDocument)

    const [deleteExternalServiceByIdMutation] = useMutation<ExternalServicesTableDeleteExternalServiceByIdMutation>(ExternalServicesTableDeleteExternalServiceByIdDocument, {
        refetchQueries: [
            { query: ExternalServicesTableGetExternalServiceListDocument },
        ],
    })

    const {
        variables: externalServiceListInput,
        storedOptions: serverSideOptions,
        setStoredOptions: setServerSideOptions,
    } = useAlexPageState({
        varsBehaviorMap: varsBehaviourMapExternalServices,
        modeWrite: [
            EUsePageStateMode.localStorage,
            EUsePageStateMode.queryString,
        ],
        modeRead: [
            EUsePageStateMode.queryString,
            EUsePageStateMode.localStorage,
        ],
        storageKey: 'externalServicesTableStorage',
        defaultValue: new Map([
            [EExternalServicesTableStoredParams.perPage, 10],
            [EExternalServicesTableStoredParams.page, 0],
        ] as [EExternalServicesTableStoredParams, any][]),
    })

    useEffect(() => {
        externalServiceListInput && lazyGetExternalServiceListQuery({
            variables: {
                input: externalServiceListInput,
            } as ExternalServicesTableGetExternalServiceListQueryVariables,
        })
    }, [externalServiceListInput])

    const location = useLocation()

    return (
        <AlexDataTable columns={ExternalServicesTableColumns}
                       data={externalServiceListQueryData?.externalService.list.data}
                       filtersMap={alexFiltersMap}
                       availablePages={externalServiceListQueryData?.externalService.list.meta.totalPages}
                       perPageOptions={PER_PAGE_OPTIONS}
                       availableElements={externalServiceListQueryData?.externalService.list.meta.totalElements}
                       columnsSelect simpleFilter footer downloadCSV
                       filterListIds={[
                           'periodCreate',
                           'periodUpdate',
                       ]}
                       serverSideOptions={serverSideOptions}
                       setServerSideOptions={setServerSideOptions}
                       actionsConfig={{
                           view: {
                               columnName: 'id',
                               path: `./../${EPageType.view}`,
                               params: new URLSearchParams([
                                   ['from', JSON.stringify(location.pathname + location.search)],
                               ]),
                           },
                           edit: {
                               columnName: 'id',
                               path: `./../${EPageType.edit}`,
                               params: new URLSearchParams([
                                   ['from', JSON.stringify(location.pathname + location.search)],
                               ]),
                           },
                           delete: {
                               columnName: 'id',
                               mutation: deleteExternalServiceByIdMutation,
                               showModal: true,
                               type: EActionDeleteType.apolloClient,
                           },
                       }}/>
    )
}