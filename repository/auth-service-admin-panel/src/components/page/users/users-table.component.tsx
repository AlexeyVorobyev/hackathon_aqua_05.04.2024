import { FC, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { PER_PAGE_OPTIONS } from '../../../globalConstants.ts'
import {
    EUsePageStateMode,
    useAlexPageState,
} from '../../../shared-react-components/functions/useAlexPageState/useAlexPageState.tsx'
import { UsersTableColumns } from './columns.data.tsx'
import { varsBehaviourMapUsers } from './vars-behaviour-map-users.adapter.ts'
import { useLazyQuery, useMutation } from '@apollo/client'
import {
    UsersTableDeleteUserByIdDocument,
    UsersTableDeleteUserByIdMutation,
    UsersTableGetUserListDocument,
    UsersTableGetUserListQuery,
    UsersTableGetUserListQueryVariables,
} from '../../../types/graphql/graphql.ts'
import { alexFiltersMap } from '../../config/alex-filters-map.data.tsx'
import {
    AlexDataTable,
    EActionDeleteType,
} from '../../../shared-react-components/alex-data-table/alex-data-table.component.tsx'
import { EPageType } from '../customization/customization-page.component.tsx'

enum EUsersTableStoredParams {
    page = 'page',
    perPage = 'perPage'
}

export const UsersTable: FC = () => {
    const [lazyGetUserListQuery, {
        data: userListQueryData,
    }] = useLazyQuery<UsersTableGetUserListQuery>(UsersTableGetUserListDocument)

    const [deleteUserByIdMutation] = useMutation<UsersTableDeleteUserByIdMutation>(UsersTableDeleteUserByIdDocument, {
        refetchQueries: [
            { query: UsersTableGetUserListDocument },
        ],
    })

    const {
        variables: userListInput,
        storedOptions: serverSideOptions,
        setStoredOptions: setServerSideOptions,
    } = useAlexPageState({
        varsBehaviorMap: varsBehaviourMapUsers,
        modeWrite: [
            EUsePageStateMode.localStorage,
            EUsePageStateMode.queryString,
        ],
        modeRead: [
            EUsePageStateMode.queryString,
            EUsePageStateMode.localStorage,
        ],
        storageKey: 'usersTableStorage',
        defaultValue: new Map([
            [EUsersTableStoredParams.perPage, 10],
            [EUsersTableStoredParams.page, 0],
        ] as [EUsersTableStoredParams, any][]),
    })

    useEffect(() => {
        userListInput && lazyGetUserListQuery({
            variables: {
                input: userListInput,
            } as UsersTableGetUserListQueryVariables,
        })
    }, [userListInput])

    const location = useLocation()

    return (
        <AlexDataTable columns={UsersTableColumns}
                       data={userListQueryData?.user.list.data}
                       filtersMap={alexFiltersMap}
                       availablePages={userListQueryData?.user.list.meta.totalPages}
                       perPageOptions={PER_PAGE_OPTIONS}
                       availableElements={userListQueryData?.user.list.meta.totalElements}
                       columnsSelect simpleFilter footer downloadCSV
                       filterListIds={[
                           'periodCreate',
                           'periodUpdate',
                           'userRole',
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
                               mutation: deleteUserByIdMutation,
                               showModal: true,
                               type: EActionDeleteType.apolloClient,
                           },
                       }}/>
    )
}