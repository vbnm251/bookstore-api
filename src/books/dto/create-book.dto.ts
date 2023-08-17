import {
	IsArray,
	IsEnum,
	IsNumber,
	IsOptional,
	IsString,
	ValidateNested,
	IsIn,
} from 'class-validator';
import { Type } from 'class-transformer';
import { COVERS, CoverType } from '../entitites/book.entity';

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

	@IsNumber()
	ageLimit: number;

	@IsNumber()
	price: number;

	@IsNumber()
	discount?: number;

	@ValidateNested()
	@Type(() => SizeDto)
	size: SizeDto;

	@IsNumber()
	pages: number;

	@IsNumber()
	weight: number;

	@IsString()
	@IsIn(COVERS)
	coverType: CoverType;
}
