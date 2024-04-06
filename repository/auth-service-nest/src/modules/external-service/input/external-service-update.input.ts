import { InputType } from '@nestjs/graphql'
import {
    ExternalServiceUpdatePayloadInput,
} from './external-service-update-payload.input'
import { updateEntityInputFactory } from '../../graphql/factory/update-entity-input.factory'

@InputType('TExternalServiceUpdateInput')
export class ExternalServiceUpdateInput extends updateEntityInputFactory<ExternalServiceUpdatePayloadInput>(ExternalServiceUpdatePayloadInput) {
}