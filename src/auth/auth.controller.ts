import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Post,
	Req,
	UseGuards,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import { validationOptions } from 'src/configs';
import { LoginDto, RegisterDto } from './dto';
import { AuthService } from './auth.service';
import { RoleGuard } from 'src/common';
import { Roles } from './entities';
import { AccessJwtGuard, RefreshGuard, RefreshJwtGuard } from './guards';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('register')
	@UsePipes(new ValidationPipe(validationOptions))
	async register(@Body() dto: RegisterDto) {
		return this.authService.register(dto, Roles.USER);
	}

	@Post('add-admin')
	@UseGuards(AccessJwtGuard, RoleGuard(Roles.ADMIN))
	@UsePipes(new ValidationPipe(validationOptions))
	async registerAdmin(@Body() dto: RegisterDto) {
		return this.authService.register(dto, Roles.ADMIN);
	}

	@Post('login')
	@HttpCode(HttpStatus.OK)
	@UsePipes(new ValidationPipe(validationOptions))
	async login(@Body() dto: LoginDto) {
		return this.authService.login(dto);
	}

	@Get('refresh')
	@UseGuards(RefreshJwtGuard, RefreshGuard)
	async refresh(@Req() req: Request) {
		return this.authService.refresh(req['passedUser']);
	}
}
