
import { theme } from '../../theme/theme.ts'
import { AlexCheckBox } from '../../../shared-react-components/form-utils/AlexCheckBox/AlexCheckBox.tsx'
import { AlexChip } from '../../../shared-react-components/AlexChip/AlexChip.tsx'
import { Stack } from '@mui/material'
import { TUserAttributes } from '../../../types/graphql/graphql.ts'
import { TCustomDataTableColumn } from '../../../shared-react-components/alex-data-table/alex-data-table.component.tsx'
import { EERoleToRusName } from '../../enum/erole-to-rus-name.enum.ts'

export const UsersTableColumns: TCustomDataTableColumn[] = [
    {
        id: 'id',
        label: 'ID',
        display: false,
    },
    {
        id: 'email',
        label: 'Почта',
    },
    {
        id: 'createdAt',
        label: 'Дата создания',
    },
    {
        id: 'updatedAt',
        label: 'Дата последнего изменения',
        display: false,
    },
    {
        id: 'role',
        label: 'Роль сервиса авторизации',
        format: (value: TUserAttributes) => (
            <AlexChip label={EERoleToRusName[value.role]}/>
        ),
    },
    {
        id: 'externalRoles',
        label: 'Роли во внешних сервисах',
        format: (value: TUserAttributes) => (
            <Stack direction={'column'} spacing={theme.spacing(1)} width={'fit-content'}>
                {value.externalRoles.map((item) => (
                    <AlexChip label={`${item.externalService.name}:${item.name}`} key={item.recognitionKey}/>
                ))}
            </Stack>
        ),
        formatText: (value: TUserAttributes) => {
            const mappedValue = value.externalRoles
                .map((item) => item.name)

            return mappedValue.length
                ? mappedValue.reduce((acc: string, item) => `${acc}  ${item}`)
                : ''
        },
        sort: false,
    },
    {
        id: 'externalServices',
        label: 'Внешние сервисы',
        format: (value: TUserAttributes) => (
            <Stack direction={'row'} spacing={theme.spacing(1)}>
                {value.externalServices.map((item) => (
                    <AlexChip label={`${item.name}`} key={item.recognitionKey}/>
                ))}
            </Stack>
        ),
        formatText: (value: TUserAttributes) => {
            const mappedValue = value.externalServices
                .map((item) => item.name)

            return mappedValue.length
                ? mappedValue.reduce((acc: string, item) => `${acc}  ${item}`)
                : ''
        },
        sort: false,
    },
    {
        id: 'verified',
        label: 'Подтверждён',
        format: (value: TUserAttributes) => (
            <AlexCheckBox value={value.verified} checked={value.verified} size={30} disabled color={{
                outline: theme.palette.primary.dark,
                checked: theme.palette.primary.main,
            }}/>
        ),
        formatText: (value: TUserAttributes) => value.verified ? 'Да' : 'Нет',
    },
]

