import {Body, Controller, Get, HttpCode, HttpStatus, Post, Query, Res, UseGuards} from '@nestjs/common'
import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiConflictResponse,
    ApiCreatedResponse,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger'
import {AuthService} from './auth.serivce'
import {ActiveUser} from '../common/decorator/active-user.decorator'
import {UniversalExceptionDto} from '../common/dto/universal-exception.dto'
import {VerifyCallbackRestInput} from './input/verify-callback-rest.input'
import {JwtRestAuthGuard} from '../common/guard/jwt-rest-auth.guard'
import {RefreshRestInput} from './input/refresh-rest.input'
import {TokenDataRestAttributes} from './attributes/token-data-rest.attributes'
import {BaseSignUpRestInput} from './input/base-sign-up-rest.input'
import {SignInRestInput} from './input/sign-in-rest.input'
import {ExternalServiceSignUpRestInput} from './input/external-service-sign-up-rest.input'

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
    ) {
    }

    @ApiConflictResponse({
        description: 'User already exists',
        type: UniversalExceptionDto,
    })
    @ApiBadRequestResponse({
        description: 'Return errors for invalid sign up fields',
        type: UniversalExceptionDto,
    })
    @ApiCreatedResponse({
        description: 'User has been successfully signed up to base service',
        type: TokenDataRestAttributes
    })
    @ApiOperation({
        summary: 'Sign-up endpoint',
        description: 'Provides functionality of sign-up user to base service',
    })
    @Post('base-sign-up')
    async baseSignUp(@Body() input: BaseSignUpRestInput): Promise<TokenDataRestAttributes> {
        return this.authService.baseSignUp(input)
    }

    @ApiConflictResponse({
        description: 'User already signed-up to this service',
        type: UniversalExceptionDto,
    })
    @ApiBadRequestResponse({
        description: 'Entity not found',
        type: UniversalExceptionDto,
    })
    @ApiCreatedResponse({
        description: 'User has been successfully signed up to external service',
        type: TokenDataRestAttributes
    })
    @ApiOperation({
        summary: 'External service sign-up endpoint',
        description: 'Provides functionality of sign up to particular external service in the system',
    })
    @ApiBearerAuth()
    @UseGuards(JwtRestAuthGuard)
    @Post('external-service-sign-up')
    async externalServiceSignUp(
        @Body() input: ExternalServiceSignUpRestInput,
        @ActiveUser('id') userId: string,
    ): Promise<TokenDataRestAttributes> {
        return this.authService.externalServiceSignUp(input, userId)
    }

    @ApiBadRequestResponse({
        description: 'Return errors for invalid sign in fields',
        type: UniversalExceptionDto,
    })
    @ApiOkResponse({
        description: 'User has been successfully signed in',
        type: TokenDataRestAttributes,
    })
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Sign-in endpoint',
        description: 'Allows to get JWT Tokens to logged user.',
    })
    @Post('sign-in')
    async signIn(@Body() input: SignInRestInput): Promise<TokenDataRestAttributes> {
        return this.authService.signIn(input)
    }

    @ApiBadRequestResponse({
        description: 'Provided refreshToken are invalid or expired',
        type: UniversalExceptionDto,
    })
    @ApiOkResponse({
        description: 'User successfully received new access and refresh token',
        type: TokenDataRestAttributes,
    })
    @ApiOperation({
        summary: 'Refresh JWT tokens endpoint',
        description: 'Allows to refresh JWT Tokens to logged user.',
    })
    @Post('refresh')
    async refresh(
        @Body() input: RefreshRestInput,
    ): Promise<TokenDataRestAttributes> {
        return this.authService.refresh(input.token)
    }

    @ApiUnauthorizedResponse({
        description: 'Provided accessToken are invalid or expired or accessToken not provided',
        type: UniversalExceptionDto,
    })
    @ApiCreatedResponse({
        description: 'User successfully received confirmation email',
    })
    @ApiOperation({
        summary: 'Send confirmation email endpoint',
        description: 'Allows to send confirmation email to current user.',
    })
    @ApiBearerAuth()
    @UseGuards(JwtRestAuthGuard)
    @Post('send-confirmation-email')
    async sendConfirmationMail(@ActiveUser('id') userId: string) {
        return this.authService.sendConfirmationMail(userId)
    }

    @ApiUnauthorizedResponse({
        description: 'Provided verifyToken are invalid or expired or accessToken not provided',
        type: UniversalExceptionDto,
    })
    @ApiOkResponse({
        description: 'User email successfully verified',
    })
    @ApiOperation({
        summary: 'Callback endpoint to verify email',
        description: 'Allows to verify email with provided token and then redirect user to main site',
    })
    @Get('verify-callback')
    async verifyCallback(
        @Res() res: Response,
        @Query() params: VerifyCallbackRestInput,
    ) {
        await this.authService.verifyCallback(
            res,
            params.token,
            params.redirectSuccess,
            params.redirectFailure,
        )
    }
}