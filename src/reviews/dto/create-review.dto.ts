import {
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString,
	Max,
	Min,
	MinLength,
} from 'class-validator';

export class CreateReviewDto {
	@IsString()
	@IsNotEmpty()
	title: string;

	@IsString()
	@MinLength(50)
	body: string;

	@IsString()
	@IsOptional()
	advantages?: string;

	@IsOptional()
	@IsString()
	disadvantages?: string;

	@IsNumber()
	@Min(0)
	@Max(5)
	rating: number;
}
