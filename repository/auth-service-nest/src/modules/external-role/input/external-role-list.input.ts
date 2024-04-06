import { ListInput } from '../../graphql/input/list.input'
import { InputType } from '@nestjs/graphql'

@InputType('TExternalRoleListInput')
export class ExternalRoleListInput extends ListInput {
}