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
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Role, UserId } from 'src/decorators/jwt-payload.decorators';
import { Types } from 'mongoose';
import { ParseObjectIdPipe } from 'src/pipes/parse-object-id.pipe';
import { validationOptions } from 'src/configs/validation.options';
import { AccessJwtGuard } from 'src/auth/guards/access-jwt.guard';
import { RoleGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/entities/user.entity';

@Controller('reviews')
export class ReviewsController {
	constructor(private readonly reviewsService: ReviewsService) {}

	@Post('create/:bookId')
	@UsePipes(new ValidationPipe(validationOptions))
	@UseGuards(AccessJwtGuard, RoleGuard(Roles.USER, Roles.USER))
	async create(
		@Body() dto: CreateReviewDto,
		@Param('bookId', ParseObjectIdPipe) bookId: Types.ObjectId,
		@UserId(ParseObjectIdPipe)
		userId: Types.ObjectId,
	) {
		//TODO: add bookId when books will be finished
		console.log(bookId);
		return this.reviewsService.create(dto, userId);
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
		return this.reviewsService.findById(reviewId);
	}

	@Patch(':reviewId')
	@UseGuards(AccessJwtGuard, RoleGuard(Roles.USER))
	@UsePipes(new ValidationPipe(validationOptions))
	async updateById(
		@Param('reviewId', ParseObjectIdPipe) reviewId: Types.ObjectId,
		@Body()
		dto: UpdateReviewDto,
		@Role() role: Roles,
		@UserId(ParseObjectIdPipe) userId: Types.ObjectId,
	) {
		return this.reviewsService.updateById(reviewId, role, userId, dto);
	}

	@Delete(':reviewId')
	@UseGuards(AccessJwtGuard, RoleGuard(Roles.USER, Roles.ADMIN))
	async deleteById(
		@Param('reviewId', ParseObjectIdPipe) reviewId: Types.ObjectId,
		@Role() role: Roles,
		@UserId(ParseObjectIdPipe) userId: Types.ObjectId,
	) {
		return this.reviewsService.deleteById(reviewId, role, userId);
	}
}
