import {
	ConflictException,
	Inject,
	Injectable,
	NotFoundException,
	UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
	ACCESS_TOKEN_SERVICE,
	REFRESH_TOKEN_SERVICE,
	USER_ALREADY_EXISTS,
	USER_MODEL,
	USER_NOT_FOUND,
	WRONG_PASSWORD,
} from './auth.constants';
import { Model } from 'mongoose';
import { Roles, UserModel } from './user.model';
import { compare, genSalt, hash } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPaylod, JwtTokenExpiresIn } from 'src/configs/jwt.config';
import { RegisterDto } from './dto/register.dto';
import { UserService } from './user.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
	constructor(
		private readonly userService: UserService,

		@Inject(ACCESS_TOKEN_SERVICE)
		private readonly accessService: JwtService,

		@Inject(REFRESH_TOKEN_SERVICE)
		private readonly refreshService: JwtService,
	) {}

	async register(dto: RegisterDto, role: Roles) {
		const user = await this.userService.findUser(dto.email, dto.username);
		if (user) {
			throw new ConflictException(USER_ALREADY_EXISTS);
		}

		const passwordHash = await this.generateStringHash(dto.password);

		const createdUser = await this.userService.saveUser(dto, passwordHash, role);
		const tokens = await this.generateTokens({
			id: createdUser._id,
			role: createdUser.role,
		});

		await this.userService.updateRefreshToken(
			createdUser._id,
			await this.generateStringHash(tokens.refreshToken),
		);

		return tokens;
	}

	async login(dto: LoginDto) {
		const user = await this.userService.findUser(dto.email, dto.username);
		if (!user) {
			throw new NotFoundException(USER_NOT_FOUND(dto.email ? 'email' : 'username'));
		}

		const isPasswordCorrect = await this.comparePasswords(
			dto.password,
			user.passwordHash,
		);
		if (!isPasswordCorrect) {
			throw new UnauthorizedException(WRONG_PASSWORD);
		}

		const tokens = await this.generateTokens({ id: user._id, role: user.role });

		await this.userService.updateRefreshToken(
			user._id,
			await this.generateStringHash(tokens.refreshToken),
		);

		return tokens;
	}

	async refresh(userId: string) {}

	private async comparePasswords(password: string, hashedPassword: string) {
		return compare(password, hashedPassword);
	}

	private async generateStringHash(str: string): Promise<string> {
		const salt = await genSalt(10);
		return hash(str, salt);
	}

	private async generateTokens(payload: JwtPaylod) {
		return {
			role: payload.role,
			expiration: JwtTokenExpiresIn,
			accessToken: await this.accessService.signAsync(payload),
			refreshToken: await this.refreshService.signAsync(payload),
		};
	}
}
