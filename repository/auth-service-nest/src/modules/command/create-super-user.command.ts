import { Inject } from '@nestjs/common'
import { Command, CommandRunner, Option } from 'nest-commander'
import { Builder } from 'builder-pattern'
import { UserService } from '../user/user.service'
import { ERole } from '../common/enum/role.enum'
import { UserCreateInput } from '../user/input/user-create.input'

interface BasicCommandOptions {
	email: string,
	password: string
}

@Command({
	name: 'create-super-user',
	description: 'Initialize super user in a system'
})
export class CreateSuperUserCommand extends CommandRunner {

	constructor(
		@Inject(UserService)
		private readonly userService: UserService,
	) {
		super()
	}

	async run(passedParam: string[], options?: BasicCommandOptions): Promise<void> {
		const userCreateInput = Builder<UserCreateInput>()
		userCreateInput
			.email(options.email)
			.password(options.password)
			.role(ERole.Admin)
		await this.userService.create(userCreateInput.build())
	}

	@Option({
		flags: '-email, --email [email]',
		description: 'Specify the email'
	})
	parseEmailString(val: string): string {
		return val
	}

	@Option({
		flags: '-password, --password [password]',
		description: 'Specify the password'
	})
	parsePasswordString(val: string): string {
		return val
	}
}