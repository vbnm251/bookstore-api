import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { USER_MODEL } from './auth.constants';
import { RegisterDto } from './dto/register.dto';
import { Roles, UserModel } from './user.model';

@Injectable()
export class UserService {
	constructor(@InjectModel(USER_MODEL) private readonly userModel: Model<UserModel>) {}

	async saveUser(dto: RegisterDto, hashedPassword: string, role: Roles = Roles.COMMON) {
		const user = await this.parseUserModel(dto, hashedPassword, role);
		return this.userModel.create(user);
	}

	async findUser(email?: string, username?: string) {
		return this.userModel
			.findOne({
				$or: [{ username }, { email }],
			})
			.exec();
	}

	async findById(id: string) {
		return this.userModel.findById(id);
	}

	async updateRefreshToken(userId: Types.ObjectId, refreshToken: string) {
		return this.userModel.findByIdAndUpdate(
			userId,
			{ $set: { refreshToken } },
			{ new: true },
		);
	}

	private async parseUserModel(
		dto: RegisterDto,
		passwordHash: string,
		role: Roles = Roles.COMMON,
	): Promise<Omit<UserModel, 'refreshToken'>> {
		return {
			email: dto.email,
			passwordHash,
			role,
			username: dto.username,
		};
	}
}
