import { Injectable, NotFoundException, Type } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
	BOOKS_MODEL,
	BOOK_NOT_FOUND,
	DEFAULT_LIMIT,
	DEFAULT_PAGE,
} from './books.constants';
import { AgeLimit, Book, Order, SortBookValues } from './entitites/book.entity';
import { Model, PipelineStage, Types, mongo } from 'mongoose';
import { CreateBookDto } from './dto/create-book.dto';
import { REVIEW_COLLECTION } from 'src/reviews/review.constants';
import { PaginationResponse } from 'src/responses/pagination.response';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable()
export class BooksService {
	constructor(@InjectModel(BOOKS_MODEL) private readonly booksModel: Model<Book>) {}

	async create(dto: CreateBookDto) {
		return this.booksModel.create(dto);
	}

	async updateById(id: Types.ObjectId, dto: UpdateBookDto) {
		const updatedBook = await this.booksModel.findByIdAndUpdate(id, dto, {
			new: true,
		});
		if (!updatedBook) {
			throw new NotFoundException(BOOK_NOT_FOUND);
		}

		return updatedBook;
	}

	async deleteById(id: Types.ObjectId) {
		const deletedBook = await this.booksModel.findByIdAndDelete(id);
		if (!deletedBook) {
			throw new NotFoundException(BOOK_NOT_FOUND);
		}
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
							pipeline: [{ $addFields: { id: '$_id' } }, { $unset: '_id' }],
						},
					},
					{
						$addFields: {
							totalReviews: { $size: '$reviews' },
							rating: { $avg: '$reviews.rating' },
							id: '$_id',
						},
					},
					{ $unset: '_id' },
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

	async getFilteredBooks(
		genres?: string[],
		publishment?: string,
		minPrice?: number,
		maxPrice?: number,
		ageLimit?: AgeLimit,
		search?: string,
		page?: number,
		limit?: number,
		sort?: SortBookValues,
		order?: Order,
	) {
		const genresFilter = genres ? { genres: { $in: genres } } : {};
		const minPriceFilter = minPrice ? { price: { $gte: minPrice } } : {};
		const maxPriceFilter = maxPrice ? { price: { $lte: maxPrice } } : {};
		const ageLimitFilter = ageLimit ? { ageLimit } : {};
		const publishmentFilter = publishment ? { publishment } : {};
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
					price: {
						$ceil: {
							$divide: [
								{
									$multiply: [
										{ $subtract: [100, '$discount'] },
										'$oldPrice',
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
					$and: [
						genresFilter,
						maxPriceFilter,
						minPriceFilter,
						ageLimitFilter,
						publishmentFilter,
					],
				},
			},
			{
				$project: {
					id: 1,
					title: 1,
					author: 1,
					totalReviews: 1,
					rating: 1,
					titleImage: 1,
					oldPrice: 1,
					price: 1,
					discount: 1,
				},
			},
		];

		if (sort) {
			let mongoOrder: 1 | -1 = 1;
			if (order == Order.desc) {
				mongoOrder = -1;
			}

			switch (sort) {
				case SortBookValues.PRICE:
					pipeline.push({ $sort: { price: mongoOrder } });
					break;
				case SortBookValues.RATING:
					pipeline.push({ $sort: { rating: mongoOrder } });
					break;
			}
		}

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
							price: number;
							totalReviews: number;
							rating: number | null;
						})[]
			  >[]
			| (Document &
					Book & {
						id: string;
						price: number;
						totalReviews: number;
						rating: number | null;
					})[];

		return response;
	}
}
