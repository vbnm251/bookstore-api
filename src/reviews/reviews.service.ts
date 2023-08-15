import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { REVIEW_MODEL, REVIEW_NOT_FOUND } from './review.constants';
import { Model, Types } from 'mongoose';
import { Review } from './entities/review.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Roles, User } from 'src/auth/entities/user.entity';
import { FORBIDDEN_ACCESS, USER_COLLECTION } from 'src/auth/auth.constants';

@Injectable()
export class ReviewsService {
	constructor(@InjectModel(REVIEW_MODEL) private readonly reviewModel: Model<Review>) {}

	async create(dto: CreateReviewDto, userId: Types.ObjectId) {
		return this.reviewModel.create({
			...dto,
			userId,
		});
	}

	async findById(reviewId: Types.ObjectId) {
		const review = (
			await this.reviewModel
				.aggregate()
				.match({ _id: reviewId })
				.lookup({
					from: USER_COLLECTION,
					localField: 'userId',
					foreignField: '_id',
					as: 'user',
				})
				.unwind('user')
				.addFields({
					name: '$user.name',
				})
				.project({
					user: 0,
				})
				.exec()
		)[0] as unknown as (Review & Document & { name: string }) | undefined;
		if (!review) {
			throw new NotFoundException(REVIEW_NOT_FOUND);
		}

		return review;
	}

	async findByUserId(userId: Types.ObjectId) {
		return this.reviewModel
			.aggregate()
			.match({ userId })
			.lookup({
				from: USER_COLLECTION,
				localField: 'userId',
				foreignField: '_id',
				as: 'user',
			})
			.unwind('user')
			.addFields({
				name: '$user.name',
			})
			.project({
				user: 0,
			})
			.exec() as unknown as (Document & User & { name: string })[];
	}

	async updateById(
		reviewId: Types.ObjectId,
		role: Roles,
		userId: Types.ObjectId,
		dto: UpdateReviewDto,
	) {
		const review = await this.findById(reviewId);
		if (role == Roles.USER && review.userId != userId) {
			throw new ForbiddenException(FORBIDDEN_ACCESS);
		}

		return this.reviewModel.findByIdAndUpdate(reviewId, dto, { new: true });
	}

	async deleteById(reviewId: Types.ObjectId, role: Roles, userId: Types.ObjectId) {
		const review = await this.findById(reviewId);
		if (role == Roles.USER && review.userId != userId) {
			throw new ForbiddenException(FORBIDDEN_ACCESS);
		}

		await this.reviewModel.findByIdAndRemove(reviewId);
	}
}
