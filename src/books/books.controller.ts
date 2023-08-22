import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	ParseArrayPipe,
	ParseEnumPipe,
	ParseFloatPipe,
	ParseIntPipe,
	Patch,
	Post,
	Query,
	Req,
	Res,
	UseGuards,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import { Roles } from 'src/auth/entities';
import { AccessJwtGuard } from 'src/auth/guards';
import { validationOptions } from 'src/configs';
import { CreateBookDto, UpdateBookDto } from './dto';
import { BooksService } from './books.service';
import { Types } from 'mongoose';
import { Request, Response } from 'express';
import {
	PaginationService,
	IncludesPipe,
	ParseObjectIdPipe,
	RoleGuard,
} from 'src/common';
import { DEFAULT_PAGE } from './books.constants';
import { AgeLimit, AgeLimits, Order, SortBookValues } from './entitites';

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
		@Query('publishment') publishment?: string,
		@Query('search') search?: string,

		@Query('sort', new ParseEnumPipe(SortBookValues, { optional: true }))
		sort?: SortBookValues,

		@Query(
			'ageLimit',
			new ParseIntPipe({ optional: true }),
			new IncludesPipe(AgeLimits, { optional: true }),
		)
		ageLimit?: AgeLimit,

		@Query('order', new ParseEnumPipe(Order, { optional: true }))
		order?: Order,
	) {
		const books = await this.booksService.getFilteredBooks(
			genres,
			publishment,
			minPrice,
			maxPrice,
			ageLimit,
			search,
			page,
			limit,
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

	@Patch(':bookId')
	@UseGuards(AccessJwtGuard, RoleGuard(Roles.ADMIN))
	@UsePipes(new ValidationPipe(validationOptions))
	async updateById(
		@Param('bookId', ParseObjectIdPipe) id: Types.ObjectId,
		@Body() dto: UpdateBookDto,
	) {
		return this.booksService.updateById(id, dto);
	}

	@Delete(':bookId')
	@UseGuards(AccessJwtGuard, RoleGuard(Roles.ADMIN))
	@UsePipes(new ValidationPipe(validationOptions))
	async deleteById(@Param('bookId', ParseObjectIdPipe) id: Types.ObjectId) {
		return this.booksService.deleteById(id);
	}
}
