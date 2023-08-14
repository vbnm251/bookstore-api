import { IsNumber, IsOptional, IsString, Max } from 'class-validator';

export class CreateReviewDto {
	@IsString()
	name: string;

	@IsString()
	title: string;

	@IsString()
	body: string;

	@IsString()
	@IsOptional()
	advantages?: string;

	@IsString()
	@IsOptional()
	disadvantages?: string;

	@IsNumber()
	@Max(5)
	rating: number;

	@IsString()
	bookId: string;
}
