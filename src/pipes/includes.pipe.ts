import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { not_includes } from './pipes.constants';

@Injectable()
export class IncludesPipe implements PipeTransform {
	constructor(
		private readonly array: readonly any[],
		private readonly options: { optional: boolean } = { optional: false },
	) {}

	transform(value: any) {
		if (value == undefined && this.options.optional) return value;

		if (this.array.includes(value)) {
			return value;
		}

		throw new BadRequestException(not_includes(this.array));
	}
}
