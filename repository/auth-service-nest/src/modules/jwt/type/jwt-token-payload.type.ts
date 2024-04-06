import { ERole } from '../../common/enum/role.enum'
import { TJwtTokenPayloadExternalServices } from './jwt-token-payload-external-services.type'

export type TJwtTokenPayload = {
	id: string
	email: string
	role: ERole
	tokenId: string
	services: TJwtTokenPayloadExternalServices[]
}