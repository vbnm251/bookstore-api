import {
	ArgumentMetadata,
	BadRequestException,
	Injectable,
	PipeTransform,
} from '@nestjs/common';
import { IsDefined, isDefined, isEnum } from 'class-validator';
import { NOT_ENUM } from './pipes.constants';

@Injectable()
export class EnumValidationPipe implements PipeTransform {
	constructor(
		private readonly validateEnum: any,
		private readonly optional: boolean = false,
	) {}

	transform(value: any, metadata: ArgumentMetadata) {
		if (value == undefined && this.optional) return value;

		console.log(value);

		if (isDefined(value) && value in this.validateEnum) {
			return this.validateEnum[value];
		}

		throw new BadRequestException(NOT_ENUM + Object.values(this.validateEnum));
	}
}
