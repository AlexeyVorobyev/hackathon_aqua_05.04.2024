import { Module } from '@nestjs/common'
import { ExternalRoleModule } from '../external-role/external-role.module'
import { UserModule } from '../user/user.module'
import { CreateSuperUserCommand } from './create-super-user.command'

@Module({
    imports: [ExternalRoleModule, UserModule],
    providers: [CreateSuperUserCommand],
    exports: [CreateSuperUserCommand],
})
export class CommandModule {
}