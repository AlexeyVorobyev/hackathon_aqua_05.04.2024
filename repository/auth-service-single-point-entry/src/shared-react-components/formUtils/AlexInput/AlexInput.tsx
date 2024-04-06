import {
    FormControl,
    IconButton,
    InputAdornment,
    StandardTextFieldProps,
    TextField,
    TextFieldProps,
} from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import React, { FC, useState } from 'react'
import { EInputType } from './AlexInputControlled.tsx'

export interface IAlexInputProps extends StandardTextFieldProps {
    label?: string
    error?: boolean,
    errorText?: string
    hidden?: boolean
    multiline?: boolean
    maxRows?: number
    inputType?: EInputType
    value: string,
    onChange: (...event: any[]) => void
    onKeyPress?: (...event: any[]) => void
}

export const AlexInput: FC<IAlexInputProps> = ({
                                                   label,
                                                   error = false,
                                                   errorText = undefined,
                                                   hidden = false,
                                                   multiline = false,
                                                   maxRows,
                                                   inputType = undefined,
                                                   value,
                                                   onChange,
                                                   onKeyPress,
                                                   ...props
                                               }) => {
    const [showPassword, setShowPassword] = useState<boolean>(!hidden)
    const handleClickShowPassword = () => setShowPassword(!showPassword)
    const handleMouseDownPassword = () => setShowPassword(!showPassword)

    const [localValueInit, setLocalValueInit] = useState<boolean>(false)
    const makeAnimationStartHandler = (e: any) => {
        const autofilled = !!e.target?.matches('*:-webkit-autofill')
        if (e.animationName === 'mui-auto-fill') {
            setLocalValueInit(true)
        }

        if (e.animationName === 'mui-auto-fill-cancel') {
            setLocalValueInit(true)
        }
    }

    return (
        <FormControl fullWidth>
            <TextField
                defaultValue={value}
                type={showPassword ? 'text' : 'password'}
                label={error && errorText ? `${label}, ${errorText}` : label}
                onKeyPress={onKeyPress}
                value={value}
                onChange={onChange}
                error={error}
                multiline={multiline}
                maxRows={maxRows}
                {...props}
                InputLabelProps={{
                    shrink: localValueInit,
                }}
                InputProps={{
                    onAnimationStart: makeAnimationStartHandler,
                    endAdornment: hidden && (
                        <InputAdornment position="end">
                            <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowPassword}
                                onMouseDown={handleMouseDownPassword}
                            >
                                {showPassword ? <Visibility/> : <VisibilityOff/>}
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
            />
        </FormControl>
    )
}