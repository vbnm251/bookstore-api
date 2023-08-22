import {
	BadRequestException,
	CanActivate,
	ExecutionContext,
	Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CART_MODEL, WRONG_PRODUCT_ID } from '../cart.constants';
import { Cart } from '../entities';

@Injectable()
export class IsInCart implements CanActivate {
	constructor(@InjectModel(CART_MODEL) private readonly cartModel: Model<Cart>) {}

	async canActivate(ctx: ExecutionContext) {
		const req = ctx.switchToHttp().getRequest();
		const bookId = req.params.bookId;
		const userId = req.user.id;

		const exists = await this.cartModel.findOne({
			user: userId,
			'products.book': bookId,
		});

		if (exists) return true;

		throw new BadRequestException(WRONG_PRODUCT_ID);
	}
}
