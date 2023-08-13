import {
	BadRequestException,
	Body,
	ConflictException,
	Controller,
	HttpCode,
	HttpStatus,
	NotFoundException,
	NotImplementedException,
	Post,
	UnauthorizedException,
	UseGuards,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import { validationOptions } from 'src/configs/validation.options';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthService } from './auth.service';
import { UserService } from './user.service';
import {
	USER_ALREADY_EXISTS,
	USER_NOT_FOUND,
	WRONG_PASSWORD,
} from './auth.constants';
import { AdminGuard } from './guards/admin-jwt.guard';
import { Roles } from './user.model';

@Controller('auth')
export class AuthController {
	constructor(
		private readonly authService: AuthService,
		private readonly userService: UserService,
	) {}

	@Post('register')
	@UsePipes(new ValidationPipe(validationOptions))
	async register(@Body() dto: RegisterDto) {
		const user = await this.userService.findUser(dto.email, dto.password);
		if (user) {
			//TODO: custom exepcetion filter
			throw new ConflictException(USER_ALREADY_EXISTS);
		}

		const passwordHash = await this.authService.generatePasswordHash(
			dto.password,
		);

		return this.userService.saveUser(dto, passwordHash);
	}

	@Post('login')
	@HttpCode(HttpStatus.OK)
	@UsePipes(new ValidationPipe(validationOptions))
	async login(@Body() dto: LoginDto) {
		const user = await this.userService.findUser(dto.email, dto.username);
		if (!user) {
			throw new NotFoundException(
				USER_NOT_FOUND(dto.email ? 'email' : 'username'),
			);
		}

		const isPasswordCorrect = await this.authService.comparePasswords(
			dto.password,
			user.passwordHash,
		);
		if (!isPasswordCorrect) {
			throw new UnauthorizedException(WRONG_PASSWORD);
		}

		return this.authService.getToken(user.role);
	}

	@Post('addAdmin')
	@UseGuards(AdminGuard)
	@UsePipes(new ValidationPipe(validationOptions))
	async registerAdmin(@Body() dto: RegisterDto) {
		const user = await this.userService.findUser(dto.email, dto.password);
		if (user) {
			throw new ConflictException(USER_ALREADY_EXISTS);
		}
		const passwordHash = await this.authService.generatePasswordHash(
			dto.password,
		);

		return this.userService.saveUser(dto, passwordHash, Roles.ADMIN);
	}
}
