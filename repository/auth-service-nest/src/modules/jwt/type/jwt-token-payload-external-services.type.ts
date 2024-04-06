import { TJwtTokenPayloadExternalRoles } from './jwt-token-payload-external-roles.type'

export type TJwtTokenPayloadExternalServices = {
    id: string
    name: string
    recognitionKey: string
    roles: TJwtTokenPayloadExternalRoles[]
}