import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { USER_MODEL } from './auth.constants';
import { RegisterDto } from './dto';
import { Roles, User } from './entities';
import { CART_MODEL } from 'src/cart/cart.constants';
import { Cart } from 'src/cart/entities';

@Injectable()
export class UserService {
	constructor(
		@InjectModel(USER_MODEL) private readonly userModel: Model<User>,
		@InjectModel(CART_MODEL) private readonly cartModel: Model<Cart>,
	) {}

	async saveUser(dto: RegisterDto, hashedPassword: string, role: Roles = Roles.USER) {
		const user = await this.parseUserModel(dto, hashedPassword, role);
		const createdUser = await this.userModel.create(user);
		await this.cartModel.create({ user: createdUser._id, products: [] });
		return createdUser;
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
	): Promise<Omit<User, 'refreshToken' | '_id'>> {
		return {
			email: dto.email,
			passwordHash,
			role,
			username: dto.username,
			name: dto.name,
		};
	}
}
