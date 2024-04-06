import { registerEnumType } from '@nestjs/graphql'

export enum EOperationStatus {
    ok = 'OK',
    error = 'ERROR'
}

registerEnumType(EOperationStatus, {
    name: 'EOperationStatus',
    description: 'Enum for operation status',
})