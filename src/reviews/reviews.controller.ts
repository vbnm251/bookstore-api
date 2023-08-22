import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	UsePipes,
	ValidationPipe,
	UseGuards,
	SetMetadata,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto, UpdateReviewDto } from './dto';
import { Role, UserId, ParseObjectIdPipe, RoleGuard } from 'src/common';
import { Types } from 'mongoose';
import { validationOptions } from 'src/configs';
import { AccessJwtGuard } from 'src/auth/guards';
import { Roles } from 'src/auth/entities';
import { ReviewOwnerGuard } from './guards';
import { GUARD_PROPERTIES } from './review.constants';

@Controller('reviews')
export class ReviewsController {
	constructor(private readonly reviewsService: ReviewsService) {}

	@Post('create/:bookId')
	@UsePipes(new ValidationPipe(validationOptions))
	@UseGuards(AccessJwtGuard, RoleGuard(Roles.USER, Roles.USER))
	async create(
		@Body() dto: CreateReviewDto,
		@Param('bookId', ParseObjectIdPipe) bookId: Types.ObjectId,
		@UserId(ParseObjectIdPipe) userId: Types.ObjectId,
	) {
		return this.reviewsService.create(dto, userId, bookId);
	}

	@Get('user/:userId')
	@UseGuards(AccessJwtGuard, RoleGuard(Roles.ADMIN))
	async findByUserId(@Param('userId', ParseObjectIdPipe) userId: Types.ObjectId) {
		return this.reviewsService.findByUserId(userId);
	}

	@Get('my-reviews')
	@UseGuards(AccessJwtGuard, RoleGuard(Roles.USER, Roles.ADMIN))
	async findMyReviews(@UserId(ParseObjectIdPipe) id: Types.ObjectId) {
		return this.reviewsService.findByUserId(id);
	}

	@Get(':reviewId')
	@UseGuards(AccessJwtGuard, RoleGuard(Roles.ADMIN))
	async findById(@Param('reviewId', ParseObjectIdPipe) reviewId: Types.ObjectId) {
		return this.reviewsService.findByIdWithUser(reviewId);
	}

	@Patch(':reviewId')
	@SetMetadata(GUARD_PROPERTIES, ['reviewId', true])
	@UseGuards(AccessJwtGuard, RoleGuard(Roles.USER, Roles.ADMIN), ReviewOwnerGuard)
	@UsePipes(new ValidationPipe(validationOptions))
	async updateById(
		@Param('reviewId', ParseObjectIdPipe) reviewId: Types.ObjectId,
		@Body() dto: UpdateReviewDto,
	) {
		return this.reviewsService.updateById(reviewId, dto);
	}

	@Delete(':reviewId')
	@SetMetadata(GUARD_PROPERTIES, ['reviewId', true])
	@UseGuards(AccessJwtGuard, RoleGuard(Roles.USER, Roles.ADMIN), ReviewOwnerGuard)
	async deleteById(@Param('reviewId', ParseObjectIdPipe) reviewId: Types.ObjectId) {
		return this.reviewsService.deleteById(reviewId);
	}
}
