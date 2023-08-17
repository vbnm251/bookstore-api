import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
	BOOKS_MODEL,
	BOOK_NOT_FOUND,
	DEFAULT_LIMIT,
	DEFAULT_PAGE,
} from './books.constants';
import { Book } from './entitites/book.entity';
import { Model, PipelineStage, Types } from 'mongoose';
import { CreateBookDto } from './dto/create-book.dto';
import { REVIEW_COLLECTION } from 'src/reviews/review.constants';
import { PaginationResponse } from 'src/responses/pagination.response';

@Injectable()
export class BooksService {
	constructor(@InjectModel(BOOKS_MODEL) private readonly booksModel: Model<Book>) {}

	async create(dto: CreateBookDto) {
		return this.booksModel.create(dto);
	}

	async findByIdWithReviews(bookId: Types.ObjectId, limit?: number) {
		const book = (
			await this.booksModel
				.aggregate([
					{
						$match: { _id: bookId },
					},
					{
						$lookup: {
							from: REVIEW_COLLECTION,
							foreignField: 'bookId',
							localField: '_id',
							as: 'reviews',
							pipeline: [
								{
									$addFields: {
										id: '$_id',
									},
								},
								{
									$unset: '_id',
								},
							],
						},
					},
					{
						$addFields: {
							totalReviews: { $size: '$reviews' },
							rating: { $avg: '$reviews.rating' },
						},
					},
					{
						$set: limit
							? {
									reviews: {
										$slice: ['$reviews', 0, limit],
									},
							  }
							: {},
					},
				])
				.exec()
		)[0];
		if (!book) {
			throw new NotFoundException(BOOK_NOT_FOUND);
		}
		return book;
	}

	//TODO: add search
	async getFilteredBooks(
		genres?: string[],
		sort?: string,
		ageLimit?: number,
		minPrice?: number,
		maxPrice?: number,
		page?: number,
		limit?: number,
		search?: string,
	) {
		const genresFilter = genres ? { genres: { $in: genres } } : {};
		const minPriceFilter = minPrice ? { calculatedPrice: { $gte: minPrice } } : {};
		const maxPriceFilter = maxPrice ? { calculatedPrice: { $lte: maxPrice } } : {};
		const ageLimitFilter = ageLimit ? { ageLimit: { $gte: ageLimit } } : {};
		const searchFilter = search
			? { $match: { $text: { $search: search, $caseSensitive: false } } }
			: { $match: {} };

		const pipeline: PipelineStage[] = [
			searchFilter,
			{
				$lookup: {
					from: REVIEW_COLLECTION,
					localField: '_id',
					foreignField: 'book',
					as: 'reviews',
				},
			},
			{
				$addFields: {
					calculatedPrice: {
						$ceil: {
							$divide: [
								{
									$multiply: [
										{ $subtract: [100, '$discount'] },
										'$price',
									],
								},
								100,
							],
						},
					},
					totalReviews: { $size: '$reviews' },
					rating: { $avg: '$reviews.rating' },
					id: '$_id',
				},
			},
			{
				$unset: ['reviews', '_id'],
			},
			{
				$match: {
					$and: [genresFilter, maxPriceFilter, minPriceFilter, ageLimitFilter],
				},
			},
		];

		if (page || limit) {
			const pageFilter = page || DEFAULT_PAGE;
			const limitFilter = limit || DEFAULT_LIMIT;
			pipeline.push(
				{
					$facet: {
						data: [
							{ $skip: (pageFilter - 1) * limitFilter },
							{ $limit: limitFilter },
						],
						pagination: [
							{ $count: 'count' },
							{
								$project: {
									totalPages: {
										$ceil: {
											$divide: ['$count', limitFilter],
										},
									},
									totalCount: '$count',
								},
							},
						],
					},
				},
				{
					$unwind: '$pagination',
				},
			);
		}

		const response = (await this.booksModel.aggregate(pipeline).exec()) as
			| PaginationResponse<
					(Document &
						Book & {
							id: string;
							calculatedPrice: number;
							totalReviews: number;
							rating: number | null;
						})[]
			  >[]
			| (Document &
					Book & {
						id: string;
						calculatedPrice: number;
						totalReviews: number;
						rating: number | null;
					})[];

		return response;
	}
}
