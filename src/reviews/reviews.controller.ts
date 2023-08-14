import {
	Body,
	Controller,
	Get,
	Logger,
	Param,
	Patch,
	Post,
	UseGuards,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { validationOptions } from 'src/configs/validation.options';

@Controller('reviews')
export class ReviewsController {
	@Post('create')
	@UsePipes(new ValidationPipe(validationOptions))
	async create(@Body() dto: CreateReviewDto) {}

	@Get(':id')
	async getById(@Param('id') id: string) {}

	@Patch(':id')
	async patchById(@Param('id') id: string) {}
}
