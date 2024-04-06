import { registerAs } from '@nestjs/config'

export default registerAs('email', () => {
	return {
		host: process.env.EMAIL_HOST_ADDRESS || 'smtp.gmail.com',
		port: Number(process.env.EMAIL_HOST_PORT) || 465,
		user: process.env.EMAIL_USER,
		pass: process.env.EMAIL_USER_PASSWORD
	}
})