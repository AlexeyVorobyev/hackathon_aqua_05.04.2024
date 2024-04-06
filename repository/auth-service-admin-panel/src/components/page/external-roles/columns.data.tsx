import { theme } from '../../theme/theme.ts'
import { AlexCheckBox } from '../../../shared-react-components/form-utils/AlexCheckBox/AlexCheckBox.tsx'
import { AlexChip } from '../../../shared-react-components/AlexChip/AlexChip.tsx'
import { Stack } from '@mui/material'
import { TExternalRoleAttributes, TExternalServiceAttributes, TUserAttributes } from '../../../types/graphql/graphql.ts'
import { TCustomDataTableColumn } from '../../../shared-react-components/alex-data-table/alex-data-table.component.tsx'
import { EERoleToRusName } from '../../enum/erole-to-rus-name.enum.ts'

export const ExternalRolesTableColumns: TCustomDataTableColumn[] = [
    {
        id: 'id',
        label: 'ID',
        display: false,
    },
    {
        id: 'recognitionKey',
        label: 'Ключ распознавания',
    },
    {
        id: 'name',
        label: 'Название',
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
        id: 'externalService',
        label: 'Сервис',
        format: (value: TExternalRoleAttributes) => (
            <Stack direction={'row'} spacing={theme.spacing(1)}>
                <AlexChip label={value.externalService.name}/>
            </Stack>
        ),
        formatText: (value: TExternalRoleAttributes) => (value.externalService.name),
        sort: false,
    },
    {
        id: 'default',
        label: 'Стандартная роль',
        format: (value: TExternalRoleAttributes) => (
            <AlexCheckBox value={value.default} checked={value.default} size={30} disabled color={{
                outline: theme.palette.primary.dark,
                checked: theme.palette.primary.main,
            }}/>
        ),
        formatText: (value: TExternalRoleAttributes) => value.default ? 'Да' : 'Нет',
    },
    {
        id: 'description',
        label: 'Описание',
        display: false,
    },
]

