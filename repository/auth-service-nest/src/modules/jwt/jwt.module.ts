import { Module } from '@nestjs/common'
import { JwtAccessModule } from './strategy/JwtAccess.module'
import { JwtRefreshModule } from './strategy/JwtRefresh.module'
import { JwtVerifyModule } from './strategy/JwtVerify.module'
import { JwtService } from './jwt.service'

@Module({
    imports: [
        JwtAccessModule,
        JwtRefreshModule,
        JwtVerifyModule,
    ],
    providers: [JwtService],
    exports: [JwtService],
})
export class JwtModule {
}