import {theme} from '../../theme/theme.ts'
import {AlexChip} from '../../../shared-react-components/AlexChip/AlexChip.tsx'
import {Stack} from '@mui/material'
import {TExternalServiceAttributes} from '../../../types/graphql/graphql.ts'
import {TCustomDataTableColumn} from '../../../shared-react-components/alex-data-table/alex-data-table.component.tsx'

export const ExternalServicesTableColumns: TCustomDataTableColumn[] = [
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
        id: 'externalRoles',
        label: 'Роли',
        format: (value: TExternalServiceAttributes) => (
            <Stack direction={'row'} spacing={theme.spacing(1)}>
                {value.externalRoles.map((item) => (
                    <AlexChip label={`${item.name}`} key={item.recognitionKey}/>
                ))}
            </Stack>
        ),
        formatText: (value: TExternalServiceAttributes) => {
            const mappedValue = value.externalRoles
                .map((item) => item.name)

            return mappedValue.length
                ? mappedValue.reduce((acc: string, item) => `${acc}  ${item}`)
                : ''
        },
        sort: false,
    },
    {
        id: 'description',
        label: 'Описание',
        display: false,
    },
]

