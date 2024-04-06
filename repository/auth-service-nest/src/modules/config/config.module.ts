import { Module } from '@nestjs/common'
import appConfig from './config/app.config'
import databaseConfig from './config/database.config'
import swaggerConfig from './config/swagger.config'
import JwtConfig from './config/jwt.config'
import emailConfig from './config/email.config'
import { validate } from '../common/validation/env.validation'
import {ConfigModule as ConfigNestModule} from '@nestjs/config'

@Module({
    imports: [
        ConfigNestModule.forRoot({
            envFilePath: `env/.env.${process.env.NODE_ENV}`,
            isGlobal: true,
            load: [appConfig, databaseConfig, swaggerConfig, JwtConfig, emailConfig],
            validate: validate,
        }),
    ],
})
export class ConfigModule {
}