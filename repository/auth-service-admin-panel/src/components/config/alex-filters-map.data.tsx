import { IAlexFilter } from '../../shared-react-components/AlexFilters/AlexFilter.tsx'
import { AlexToggle } from '../../shared-react-components/form-utils/AlexToggle/AlexToggle.tsx'
import { ERole } from '../../types/graphql/graphql.ts'
import { EERoleToRusName } from '../enum/erole-to-rus-name.enum.ts'
import {
    AlexDatePeriodPickerControlled,
} from '../../shared-react-components/form-utils/alex-date-picker/alex-date-period-picker-controlled.component.tsx'
import {
    EDatePickerType,
} from '../../shared-react-components/form-utils/alex-date-picker/alex-date-picker.component.tsx'

export const alexFiltersMap: Map<string, IAlexFilter> = new Map([
    ['userRole', {
        label: 'Роль сервиса авторизации',
        component: (
            <AlexToggle name={'userRole'}
                        options={
                            Object.values(ERole).map((item) => {
                                return {
                                    id: item,
                                    name: EERoleToRusName[item],
                                }
                            })
                        }/>
        ),
    }],
    ['periodCreate', {
        label: 'Период создания',
        component: (
            <AlexDatePeriodPickerControlled name={'periodCreate'}
                                            configFirstInput={{
                                                label: 'Начальная дата',
                                                type: EDatePickerType.dateTime,
                                                slotProps: {
                                                    field: {
                                                        clearable: true,
                                                    },
                                                },
                                            }}
                                            configSecondInput={{
                                                label: 'Конечная дата',
                                                type: EDatePickerType.dateTime,
                                                slotProps: {
                                                    field: {
                                                        clearable: true,
                                                    },
                                                },
                                            }}/>
        ),
    }],
    ['periodUpdate', {
        label: 'Период последнего изменения',
        component: (
            <AlexDatePeriodPickerControlled name={'periodUpdate'}
                                            configFirstInput={{
                                                label: 'Начальная дата',
                                                type: EDatePickerType.dateTime,
                                                slotProps: {
                                                    field: {
                                                        clearable: true,
                                                    },
                                                },
                                            }}
                                            configSecondInput={{
                                                label: 'Конечная дата',
                                                type: EDatePickerType.dateTime,
                                                slotProps: {
                                                    field: {
                                                        clearable: true,
                                                    },
                                                },
                                            }}/>
        ),
    }],
])