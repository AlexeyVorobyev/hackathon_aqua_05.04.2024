import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger'
import { Controller, Get, UseGuards } from '@nestjs/common'
import { UserService } from './user.service'
import { UniversalExceptionDto } from '../common/dto/universal-exception.dto'
import { Roles } from '../common/decorator/roles.decorator'
import { ERole } from '../common/enum/role.enum'
import { JwtRestAuthGuard } from '../common/guard/jwt-rest-auth.guard'
import { RoleRestGuard } from '../common/guard/role-rest.guard'
import { ActiveUser } from '../common/decorator/active-user.decorator'
import { UserRestAttributes } from './attributes/user-rest.attributes'

@ApiTags('user')
@Controller('user')
export class UserController {
    constructor(
        private readonly usersService: UserService
    ) {
    }

    @ApiUnauthorizedResponse({
        description: 'Unauthorized',
        type: UniversalExceptionDto
    })
    @ApiOkResponse({
        description: 'Get logged in user\'s details',
        type: UserRestAttributes
    })
    @ApiOperation({
        summary: 'Current user information endpoint',
        description: 'Provides user information.'
    })
    @ApiBearerAuth()
    @UseGuards(JwtRestAuthGuard, RoleRestGuard)
    @Roles(ERole.User, ERole.Moderator, ERole.Admin)
    @Get('me')
    async getMe(@ActiveUser('id') userId: string): Promise<UserRestAttributes> {
        return this.usersService.getOne(userId)
    }
}