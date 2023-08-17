import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { REVIEW_MODEL, REVIEW_NOT_FOUND } from './review.constants';
import { Model, Types } from 'mongoose';
import { Review } from './entities/review.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Roles, User } from 'src/auth/entities/user.entity';
import { FORBIDDEN_ACCESS, USER_COLLECTION, USER_MODEL } from 'src/auth/auth.constants';
import { UserId } from 'src/decorators/jwt-payload.decorators';

@Injectable()
export class ReviewsService {
	constructor(
		@InjectModel(REVIEW_MODEL) private readonly reviewModel: Model<Review>,
		@InjectModel(USER_MODEL) private readonly userModel: Model<User>,
	) {}

	async create(dto: CreateReviewDto, userId: Types.ObjectId, bookId: Types.ObjectId) {
		return this.reviewModel.create({
			...dto,
			user: userId,
			book: bookId,
		});
	}

	async findById(reviewId: Types.ObjectId) {
		const review = await this.reviewModel
			.findById(reviewId)
			.populate({
				path: 'user',
				select: ['username', 'name'],
				model: this.userModel,
			})
			.exec();

		if (!review) {
			throw new NotFoundException(REVIEW_NOT_FOUND);
		}

		return review;
	}

	async findByUserId(userId: Types.ObjectId) {
		return this.reviewModel
			.find({ user: userId })
			.populate({
				path: 'user',
				select: ['username', 'name'],
				model: this.userModel,
			})
			.exec();
	}

	async updateById(
		reviewId: Types.ObjectId,
		role: Roles,
		userId: Types.ObjectId,
		dto: UpdateReviewDto,
	) {
		const review = await this.findById(reviewId);
		if (role == Roles.USER && review.user._id != userId) {
			throw new ForbiddenException(FORBIDDEN_ACCESS);
		}

		return this.reviewModel
			.findByIdAndUpdate(reviewId, dto, { new: true })
			.populate({
				path: 'user',
				select: ['username', 'name'],
				model: this.userModel,
			})
			.exec();
	}

	async deleteById(reviewId: Types.ObjectId, role: Roles, userId: Types.ObjectId) {
		const review = await this.findById(reviewId);
		if (role == Roles.USER && review.user._id != userId) {
			throw new ForbiddenException(FORBIDDEN_ACCESS);
		}

		await this.reviewModel.findByIdAndRemove(reviewId).exec();
	}
}
