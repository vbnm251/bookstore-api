import {
	CanActivate,
	ExecutionContext,
	ForbiddenException,
	Injectable,
} from '@nestjs/common';
import { ReviewsService } from '../reviews.service';
import { Roles } from 'src/auth/entities';
import { FORBIDDEN_ACCESS } from 'src/auth/auth.constants';
import { Reflector } from '@nestjs/core';
import { GUARD_PROPERTIES } from '../review.constants';

@Injectable()
export class ReviewOwnerGuard implements CanActivate {
	constructor(
		private readonly reviewService: ReviewsService,
		private reflector: Reflector,
	) {}

	async canActivate(ctx: ExecutionContext) {
		const [property, passAdmin] = this.reflector.get<[string, boolean]>(
			GUARD_PROPERTIES,
			ctx.getHandler(),
		);

		const req = ctx.switchToHttp().getRequest();
		const userId = req.user.id as string;
		const userRole = req.user.role as Roles;

		if (userRole == Roles.ADMIN && passAdmin) return true;

		const reviewId = req.params[property] as string;
		const review = await this.reviewService.findById(reviewId);
		if (review.user._id.toHexString() === userId) {
			return true;
		}

		throw new ForbiddenException(FORBIDDEN_ACCESS);
	}
}
