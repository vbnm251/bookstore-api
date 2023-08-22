import {
	ConflictException,
	Inject,
	Injectable,
	NotFoundException,
	UnauthorizedException,
} from '@nestjs/common';
import {
	ACCESS_TOKEN_SERVICE,
	REFRESH_TOKEN_SERVICE,
	USER_ALREADY_EXISTS,
	USER_NOT_FOUND,
	WRONG_PASSWORD,
} from './auth.constants';
import { Roles, User } from './entities/user.entity';
import { compare, genSalt, hash } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPaylod, JwtTokenExpiresIn } from 'src/configs';
import { RegisterDto, LoginDto } from './dto';
import { UserService } from './user.service';
import { Types } from 'mongoose';

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
			email: createdUser.email,
			name: createdUser.name,
			role: createdUser.role,
			username: createdUser.username,
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
			throw new NotFoundException(USER_NOT_FOUND);
		}

		const isPasswordCorrect = await this.comparePasswords(
			dto.password,
			user.passwordHash,
		);
		if (!isPasswordCorrect) {
			throw new UnauthorizedException(WRONG_PASSWORD);
		}

		const tokens = await this.generateTokens({
			id: user._id,
			email: user.email,
			name: user.name,
			role: user.role,
			username: user.username,
		});

		await this.userService.updateRefreshToken(
			user._id,
			await this.generateStringHash(tokens.refreshToken),
		);

		return tokens;
	}

	async refresh(user: User & { _id: Types.ObjectId }) {
		const tokens = await this.generateTokens({
			id: user._id,
			email: user.email,
			name: user.name,
			role: user.role,
			username: user.username,
		});
		await this.userService.updateRefreshToken(
			user._id,
			await this.generateStringHash(tokens.refreshToken),
		);

		return tokens;
	}

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
