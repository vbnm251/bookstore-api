import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Post,
	UseGuards,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import { validationOptions } from 'src/configs/validation.options';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthService } from './auth.service';
import { RoleGuard } from './guards/roles.guard';
import { RefreshGuard, RefreshJwtGuard } from './guards/refresh-jwt.guard';
import { Roles } from './user.model';
import { AccessJwtGuard } from './guards/access-jwt.guard';
import { UserId } from 'src/decorators/param.decorators';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('register')
	@UsePipes(new ValidationPipe(validationOptions))
	async register(@Body() dto: RegisterDto) {
		return this.authService.register(dto, Roles.COMMON);
	}

	@Post('addAdmin')
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
	async refresh(@UserId() userId: string) {
		return this.authService.refresh(userId);
	}
}
