import { FC, useEffect } from 'react'
import {
    AlexDataTable,
    EActionDeleteType,
} from '../../../shared-react-components/alex-data-table/alex-data-table.component.tsx'
import { alexFiltersMap } from '../../config/alex-filters-map.data.tsx'
import { PER_PAGE_OPTIONS } from '../../../globalConstants.ts'
import { ExternalRolesTableColumns } from './columns.data.tsx'
import { useLazyQuery, useMutation } from '@apollo/client'
import {
    ExternalRolesTableDeleteExternalRoleByIdDocument,
    ExternalRolesTableDeleteExternalRoleByIdMutation,
    ExternalRolesTableGetExternalRoleListDocument,
    ExternalRolesTableGetExternalRoleListQuery,
    ExternalRolesTableGetExternalRoleListQueryVariables,
} from '../../../types/graphql/graphql.ts'
import {
    EUsePageStateMode,
    useAlexPageState,
} from '../../../shared-react-components/functions/useAlexPageState/useAlexPageState.tsx'
import { useLocation } from 'react-router-dom'
import { varsBehaviourMapExternalRoles } from './vars-behaviour-map-external-roles.adapter.ts'
import {EPageType} from '../customization/customization-page.component.tsx'

enum EExternalRolesTableStoredParams {
    page = 'page',
    perPage = 'perPage'
}

export const ExternalRolesTable: FC = () => {
    const [lazyGetExternalRoleListQuery, {
        data: externalRoleListQueryData,
    }] = useLazyQuery<ExternalRolesTableGetExternalRoleListQuery>(ExternalRolesTableGetExternalRoleListDocument)

    const [deleteExternalRoleByIdMutation] = useMutation<ExternalRolesTableDeleteExternalRoleByIdMutation>(ExternalRolesTableDeleteExternalRoleByIdDocument, {
        refetchQueries: [
            { query: ExternalRolesTableGetExternalRoleListDocument },
        ],
    })

    const {
        variables: externalRoleListInput,
        storedOptions: serverSideOptions,
        setStoredOptions: setServerSideOptions,
    } = useAlexPageState({
        varsBehaviorMap: varsBehaviourMapExternalRoles,
        modeWrite: [
            EUsePageStateMode.localStorage,
            EUsePageStateMode.queryString,
        ],
        modeRead: [
            EUsePageStateMode.queryString,
            EUsePageStateMode.localStorage,
        ],
        storageKey: 'externalRolesTableStorage',
        defaultValue: new Map([
            [EExternalRolesTableStoredParams.perPage, 10],
            [EExternalRolesTableStoredParams.page, 0],
        ] as [EExternalRolesTableStoredParams, any][]),
    })

    useEffect(() => {
        externalRoleListInput && lazyGetExternalRoleListQuery({
            variables: {
                input: externalRoleListInput,
            } as ExternalRolesTableGetExternalRoleListQueryVariables,
        })
    }, [externalRoleListInput])

    const location = useLocation()

    return (
        <AlexDataTable columns={ExternalRolesTableColumns}
                       data={externalRoleListQueryData?.externalRole.list.data}
                       filtersMap={alexFiltersMap}
                       availablePages={externalRoleListQueryData?.externalRole.list.meta.totalPages}
                       perPageOptions={PER_PAGE_OPTIONS}
                       availableElements={externalRoleListQueryData?.externalRole.list.meta.totalElements}
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
                               mutation: deleteExternalRoleByIdMutation,
                               showModal: true,
                               type: EActionDeleteType.apolloClient,
                           },
                       }}/>
    )
}