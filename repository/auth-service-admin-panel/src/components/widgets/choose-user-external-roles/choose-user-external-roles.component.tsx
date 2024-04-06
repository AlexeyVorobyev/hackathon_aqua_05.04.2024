import {FC, useState} from 'react'
import {
    AlexAutocomplete, TAlexAutocompleteOption,
} from '../../../shared-react-components/form-utils/alex-autocomplete/alex-autocomplete.component.tsx'
import {Controller, useFormContext} from 'react-hook-form'
import {Stack, useTheme} from '@mui/material'
import {GLOBAL_CONFIG} from '../../../globalConfig.ts'

export type TChooseUserExternalRolesValue = {
    externalServiceId: string,
    externalRolesId: string[]
}[]

export type TChooseUserExternalRolesOptions = {
    externalServiceId: string,
    externalRoles: TAlexAutocompleteOption[]
}

interface IChooseUserExternalRolesProps {
    name: string,
    externalRolesOptions: TChooseUserExternalRolesOptions[]
    externalServiceOptions: TAlexAutocompleteOption[]
}

export const ChooseUserExternalRoles: FC<IChooseUserExternalRolesProps> = ({
                                                                               externalRolesOptions,
                                                                               externalServiceOptions,
                                                                               name,
                                                                           }) => {
    console.debug('Service options', externalServiceOptions)

    const {control} = useFormContext()

    const [inputValues, setInputValues] = useState<string[]>(externalServiceOptions.map(() => ''))

    const handleChangeInputValue = (value: string, index: number) => {
        setInputValues((prevState) => {
            prevState[index] = value
            return [...prevState]
        })
    }

    const theme = useTheme()

    return (
        <Controller
            name={name}
            control={control}
            defaultValue={[]}
            render={({field: {onChange, value}}) => {
                console.debug(value, 'VALUE OF CHOOSE')
                const curVal = value as TChooseUserExternalRolesValue
                return (
                    <Stack direction={'column'} gap={theme.spacing(2)} width={'100%'}>
                        {externalServiceOptions.map((item, index) => {
                            const externalRolesId = curVal
                                ?.find((_item) => _item.externalServiceId === item.id)
                                ?.externalRolesId || []

                            const handleOnChange = (newValue: string[]) => {
                                console.debug(newValue, 'new ids')
                                if (curVal.find((_item) => _item.externalServiceId === item.id)) {
                                    const newCurVal = curVal?.map((_item) => {
                                        if (_item.externalServiceId === item.id) {
                                            _item.externalRolesId = newValue
                                        }
                                        return _item
                                    })
                                    console.debug(newCurVal)
                                    onChange(newCurVal)
                                }
                                else {
                                    curVal.push({
                                        externalServiceId: item.id,
                                        externalRolesId: newValue
                                    })
                                    onChange(curVal)
                                }
                            }

                            return (
                                <AlexAutocomplete value={externalRolesId}
                                                  onChange={(value) => handleOnChange(value)}
                                                  label={item.title} multiple
                                                  options={
                                                      externalRolesOptions
                                                          .find((_item) => _item.externalServiceId === item.id)?.externalRoles
                                                      || []
                                                  }
                                                  onChangeInputValue={(event, value) => handleChangeInputValue(value, index)}
                                                  inputValue={inputValues[index]}/>
                            )
                        })}
                    </Stack>
                )
            }}
        />
    )
}