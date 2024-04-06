import { registerAs } from '@nestjs/config'
import * as process from 'process'

export default registerAs('app', () => {
	return {
		nodeEnv: process.env.NODE_ENV || 'development',
		port: parseInt(process.env.PORT, 10) || 3000,
		address: process.env.ADDRESS || 'https://someaddress.su/api',
		redirectSuccess: process.env.REDIRECT_SUCCESS || 'https://somefrontaddress.su',
		redirectFailure: process.env.REDIRECT_FAILURE || 'https://somefrontaddress.su'
	}
})