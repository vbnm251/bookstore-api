import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { Types } from 'mongoose';
import { INVALID_OBJECTID } from './pipes.constants';

@Injectable()
export class ParseObjectIdPipe implements PipeTransform {
	transform(value: any) {
		const validObjectId = Types.ObjectId.isValid(value);

		if (!validObjectId) {
			throw new BadRequestException(INVALID_OBJECTID);
		}

		return Types.ObjectId.createFromHexString(value);
	}
}
