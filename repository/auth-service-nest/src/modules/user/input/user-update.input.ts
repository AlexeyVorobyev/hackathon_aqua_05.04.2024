import { IdInput } from '../../graphql/input/id.input'
import { UserUpdatePayloadInput } from './user-update-payload.input'
import { Field, InputType } from '@nestjs/graphql'
import { updateEntityInputFactory } from '../../graphql/factory/update-entity-input.factory'

@InputType('TUserUpdateInput')
export class UserUpdateInput extends updateEntityInputFactory<UserUpdatePayloadInput>(UserUpdatePayloadInput) {
}