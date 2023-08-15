import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { USER_MODEL } from './auth.constants';
import { RegisterDto } from './dto/register.dto';
import { Roles, User } from './entities/user.entity';

@Injectable()
export class UserService {
	constructor(@InjectModel(USER_MODEL) private readonly userModel: Model<User>) {}

	async saveUser(dto: RegisterDto, hashedPassword: string, role: Roles = Roles.USER) {
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
		return this.userModel.findById(id).exec();
	}

	async updateRefreshToken(userId: Types.ObjectId, refreshToken: string) {
		return this.userModel
			.findByIdAndUpdate(userId, { $set: { refreshToken } }, { new: true })
			.exec();
	}

	private async parseUserModel(
		dto: RegisterDto,
		passwordHash: string,
		role: Roles = Roles.USER,
	): Promise<Omit<User, 'refreshToken'>> {
		return {
			email: dto.email,
			passwordHash,
			role,
			username: dto.username,
			name: dto.name,
		};
	}
}
