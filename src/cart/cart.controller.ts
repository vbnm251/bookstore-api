import {
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	ParseIntPipe,
	Patch,
	Post,
	Query,
	UseGuards,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { Roles } from 'src/auth/entities';
import { AccessJwtGuard } from 'src/auth/guards';
import { RoleGuard, UserId, ParseObjectIdPipe } from 'src/common';
import { CartService } from './cart.service';
import { BookExistsGuard } from '../books/guards';
import { IsInCart } from './guards';

@Controller('cart')
@UseGuards(AccessJwtGuard, RoleGuard(Roles.USER, Roles.ADMIN))
export class CartController {
	constructor(private readonly cartService: CartService) {}

	@Post('add/:bookId')
	@HttpCode(HttpStatus.OK)
	@UseGuards(BookExistsGuard)
	async addProduct(
		@Param('bookId', ParseObjectIdPipe) bookId: Types.ObjectId,
		@UserId(ParseObjectIdPipe) userId: Types.ObjectId,
	) {
		return this.cartService.addProduct(bookId, userId);
	}

	@Get()
	async getCart(@UserId(ParseObjectIdPipe) userId: Types.ObjectId) {
		return this.cartService.getCart(userId);
	}

	@Patch(':bookId')
	@UseGuards(IsInCart)
	async editAmount(
		@UserId(ParseObjectIdPipe) userId: Types.ObjectId,
		@Param('bookId', ParseObjectIdPipe) bookId: Types.ObjectId,
		@Query('amount', ParseIntPipe) newAmount: number,
	) {
		return this.cartService.editAmount(bookId, userId, newAmount);
	}

	@Delete('clear')
	async clearCart(@UserId(ParseObjectIdPipe) userId: Types.ObjectId) {
		return this.cartService.clearCart(userId);
	}

	@Delete(':bookId')
	@UseGuards(IsInCart)
	async deleteProduct(
		@UserId(ParseObjectIdPipe) userId: Types.ObjectId,
		@Param('bookId', ParseObjectIdPipe) bookId: Types.ObjectId,
	) {
		return this.cartService.deleteProduct(bookId, userId);
	}
}
