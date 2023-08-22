import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateReviewDto, UpdateReviewDto } from './dto';
import { REVIEW_MODEL, REVIEW_NOT_FOUND } from './review.constants';
import { Model, Types } from 'mongoose';
import { Review } from './entities';
import { InjectModel } from '@nestjs/mongoose';
import { Roles, User } from 'src/auth/entities';
import { FORBIDDEN_ACCESS, USER_MODEL } from 'src/auth/auth.constants';

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

	async findById(id: string) {
		return this.reviewModel.findById(id);
	}

	async findByIdWithUser(reviewId: Types.ObjectId) {
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
		dto: UpdateReviewDto,
	) {
		return this.reviewModel
			.findByIdAndUpdate(reviewId, dto, { new: true })
			.populate({
				path: 'user',
				select: ['username', 'name'],
				model: this.userModel,
			})
			.exec();
	}

	async deleteById(reviewId: Types.ObjectId) {
		await this.reviewModel.findByIdAndRemove(reviewId).exec();
	}
}
