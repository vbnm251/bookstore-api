import {
	IsArray,
	IsNumber,
	IsOptional,
	IsString,
	ValidateNested,
	IsIn,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Covers, CoverType, AgeLimits } from '../entitites/book.entity';
import { DefaultValuePipe } from '@nestjs/common';

class SizeDto {
	@IsNumber()
	width: number;

	@IsNumber()
	height: number;

	@IsNumber()
	length: number;
}

export class CreateBookDto {
	@IsString()
	title: string;

	@IsString()
	author: string;

	@IsString()
	@IsOptional()
	titleImage?: string;

	@IsString({ each: true })
	@IsArray()
	images: string[];

	@IsString()
	description: string;

	@IsString({ each: true })
	@IsArray()
	genres: string[];

	@IsString()
	publishment: string;

	@IsNumber()
	publichYear: number;

	@IsOptional()
	@IsIn(AgeLimits)
	ageLimit?: number;

	@IsNumber()
	oldPrice: number;

	@IsNumber()
	@IsOptional()
	discount?: number = 0;

	@ValidateNested()
	@Type(() => SizeDto)
	size: SizeDto;

	@IsNumber()
	pages: number;

	@IsNumber()
	weight: number;

	@IsString()
	@IsIn(Covers)
	coverType: CoverType;
}
