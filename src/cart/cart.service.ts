import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PopulateOptions, Types } from 'mongoose';
import { CART_MODEL, WRONG_PRODUCT_ID } from './cart.constants';
import { Cart } from './entities';
import { BOOKS_MODEL } from 'src/books/books.constants';
import { Book } from 'src/books/entitites';

const bookPopulateOptions: PopulateOptions = {
	path: 'products.book',
};

@Injectable()
export class CartService {
	constructor(
		@InjectModel(CART_MODEL) private readonly cartModel: Model<Cart>,
		@InjectModel(BOOKS_MODEL) private readonly bookModel: Model<Book>,
	) {}

	async addProduct(book: Types.ObjectId, user: Types.ObjectId) {
		return this.cartModel
			.findOneAndUpdate(
				{ user },
				{ $push: { products: { amount: 1, book } } },
				{ new: true },
			)
			.populate({ ...bookPopulateOptions, model: this.bookModel })
			.exec();
	}

	async getCart(user: Types.ObjectId) {
		return this.cartModel
			.findOne({ user })
			.populate({ ...bookPopulateOptions, model: this.bookModel })
			.exec();
	}

	async editAmount(book: Types.ObjectId, user: Types.ObjectId, amount: number) {
		const cart = await this.cartModel
			.findOneAndUpdate(
				{ user, 'products.book': book },
				{
					$set: {
						'products.$.amount': amount,
					},
				},
				{ new: true },
			)
			.populate({ ...bookPopulateOptions, model: this.bookModel })
			.exec();

		if (!cart) {
			throw new BadRequestException(WRONG_PRODUCT_ID);
		}

		return cart;
	}

	async clearCart(user: Types.ObjectId) {
		return this.cartModel
			.findOneAndUpdate({ user }, { $set: { products: [] } }, { new: true })
			.populate({ ...bookPopulateOptions, model: this.bookModel })
			.exec();
	}

	async deleteProduct(book: Types.ObjectId, user: Types.ObjectId) {
		return this.cartModel
			.findOneAndUpdate({ user }, { $pull: { products: { book } } }, { new: true })
			.populate({ ...bookPopulateOptions, model: this.bookModel })
			.exec();
	}
}
