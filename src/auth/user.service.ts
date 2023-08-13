import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { USER_MODEL } from './auth.constants';
import { RegisterDto } from './dto/register.dto';
import { Roles, UserModel } from './user.model';
import { genSalt, hash } from 'bcrypt';

@Injectable()
export class UserService {
	constructor(
		@InjectModel(USER_MODEL) private readonly userModel: Model<UserModel>,
	) {}

	async saveUser(
		dto: RegisterDto,
		hashedPassword: string,
		role: Roles = Roles.COMMON,
	) {
		const user = await this.parseUserModel(dto, hashedPassword, role);
		return this.userModel.create(user);
	}

	async findUser(email: string, username: string) {
		if (email) {
			return this.userModel.findOne({ email }).exec();
		}

		return this.userModel.findOne({ username }).exec();
	}

	private async parseUserModel(
		dto: RegisterDto,
		passwordHash: string,
		role: Roles = Roles.COMMON,
	): Promise<UserModel> {
		return {
			email: dto.email,
			passwordHash,
			role,
			username: dto.username,
		};
	}
}
