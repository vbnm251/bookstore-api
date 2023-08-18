import {
	Body,
	Controller,
	Get,
	Param,
	ParseArrayPipe,
	ParseEnumPipe,
	ParseFloatPipe,
	ParseIntPipe,
	Post,
	Query,
	Req,
	Res,
	UseGuards,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import { Roles } from 'src/auth/entities/user.entity';
import { AccessJwtGuard } from 'src/auth/guards/access-jwt.guard';
import { RoleGuard } from 'src/auth/guards/roles.guard';
import { validationOptions } from 'src/configs/validation.options';
import { CreateBookDto } from './dto/create-book.dto';
import { BooksService } from './books.service';
import { ParseObjectIdPipe } from 'src/pipes/parse-object-id.pipe';
import { Types } from 'mongoose';
import { Request, Response } from 'express';
import { PaginationService } from './pagination.service';
import { DEFAULT_LIMIT, DEFAULT_PAGE } from './books.constants';
import { PaginationResponse } from 'src/responses/pagination.response';
import { AgeLimit, Order, SortBookValues } from './entitites/book.entity';
import { EnumValidationPipe } from 'src/pipes/enum-validation.pipe';

@Controller('books')
export class BooksController {
	constructor(
		private readonly booksService: BooksService,
		private readonly paginationService: PaginationService,
	) {}

	@Post('create')
	@UseGuards(AccessJwtGuard, RoleGuard(Roles.ADMIN))
	@UsePipes(new ValidationPipe(validationOptions))
	async create(@Body() dto: CreateBookDto) {
		return this.booksService.create(dto);
	}

	@Get(':bookId')
	async findById(
		@Param('bookId', ParseObjectIdPipe) bookId: Types.ObjectId,
		@Query('limit', new ParseIntPipe({ optional: true })) limit: number,
	) {
		return this.booksService.findByIdWithReviews(bookId, limit);
	}

	@Get()
	async find(
		@Res() res: Response,
		@Req() req: Request,

		@Query('genres', new ParseArrayPipe({ optional: true })) genres?: string[],
		@Query('minPrice', new ParseFloatPipe({ optional: true })) minPrice?: number,
		@Query('maxPrice', new ParseFloatPipe({ optional: true })) maxPrice?: number,
		@Query('page', new ParseIntPipe({ optional: true })) page?: number,
		@Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
		@Query('search') search?: string,

		@Query('sort', new EnumValidationPipe(SortBookValues, true))
		sort?: SortBookValues,

		@Query('ageLimit', new EnumValidationPipe(AgeLimit, true))
		ageLimit?: AgeLimit,

		@Query('order', new EnumValidationPipe(SortBookValues, true))
		order?: Order,
	) {
		const books = await this.booksService.getFilteredBooks(
			genres,
			minPrice,
			maxPrice,
			page,
			limit,
			search,
			ageLimit,
			sort,
			order,
		);
		if (!PaginationService.isPagination(books[0])) {
			return res.json(books);
		}

		return (
			await this.paginationService.setXTotalHeaders(
				res,
				req,
				{ pagination: books[0].pagination },
				page || DEFAULT_PAGE,
			)
		).json(books[0].data);
	}
}
