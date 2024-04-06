import { ListInput } from '../../graphql/input/list.input'
import { InputType } from '@nestjs/graphql'

@InputType('TExternalServiceListInput')
export class ExternalServiceListInput extends ListInput {
}