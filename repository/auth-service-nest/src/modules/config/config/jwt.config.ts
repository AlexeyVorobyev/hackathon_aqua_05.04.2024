import { registerAs } from '@nestjs/config'

export default registerAs('jwt', () => {
	return {
		accessSecret: process.env.JWT_ACCESS_TOKEN_SECRET,
		refreshSecret: process.env.JWT_REFRESH_TOKEN_SECRET,
		verifySecret: process.env.JWT_VERIFY_TOKEN_SECRET,
		accessTokenTtl: Number(process.env.JWT_ACCESS_TOKEN_TTL),
		refreshTokenTtl: Number(process.env.JWT_REFRESH_TOKEN_TTL),
		verifyTokenTtl: Number(process.env.JWT_VERIFY_TOKEN_TTL)
	}
})