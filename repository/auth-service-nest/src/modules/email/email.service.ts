import { Inject, Injectable } from '@nestjs/common'
import { MailerService } from '@nestjs-modules/mailer'
import { render } from '@react-email/render'
import { ConfigType } from '@nestjs/config'
import appConfig from '../config/config/app.config'
import { UserEntity } from '../user/entity/user.entity'
import { VerifyEmailTemplate } from './template/verify-email.template'
import { ReactElement } from 'react'

@Injectable()
export class EmailService {
	constructor(
		@Inject(MailerService)
		private mailerService: MailerService,
		@Inject(appConfig.KEY)
		private readonly appConfiguration: ConfigType<typeof appConfig>
	) {
	}

	async sendUserConfirmation(user: UserEntity, jwtToken: string) {
		await this.mailerService.sendMail({
			to: user.email,
			subject: 'Welcome to our app! Confirm your Email.',
			html: render(VerifyEmailTemplate({
				username: user.email,
				token: jwtToken,
				applicationAddress: this.appConfiguration.address,
				redirectSuccessAddress: this.appConfiguration.redirectSuccess,
				redirectFailureAddress: this.appConfiguration.redirectFailure
			}) as ReactElement),
			context: {
				name: user.email
			}
		})
	}
}