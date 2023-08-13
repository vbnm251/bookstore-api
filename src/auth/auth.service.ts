import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { USER_MODEL } from './auth.constants';
import { Model } from 'mongoose';
import { Roles, UserModel } from './user.model';
import { compare, genSalt, hash } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
	constructor(
		@InjectModel(USER_MODEL) private readonly userModel: Model<UserModel>,
		private readonly jwtService: JwtService,
	) {}

	async comparePasswords(password: string, hashedPassword: string) {
		return compare(password, hashedPassword);
	}

	async generatePasswordHash(password: string): Promise<string> {
		const salt = await genSalt(10);
		return hash(password, salt);
	}

	async getToken(role: Roles) {
		const payload = { role };
		return {
			role,
			accessToken: await this.jwtService.signAsync(payload, {
				algorithm: 'HS256',
				expiresIn: '7d',
			}),
		};
	}
}
