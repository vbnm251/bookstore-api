import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from 'src/auth/entities/user.entity';
import { CART_COLLECTION } from '../cart.constants';
import { Schema as MongooseSchema, model } from 'mongoose';
import { USER_COLLECTION } from 'src/auth/auth.constants';
import { BOOK_COLLECTION } from 'src/books/books.constants';
import { Book, calculatePrice } from 'src/books/entitites/book.entity';

@Schema({ timestamps: true, _id: false, versionKey: false })
class CartProduct {
	@Prop()
	amount: number;

	@Prop({ type: MongooseSchema.Types.ObjectId, ref: BOOK_COLLECTION })
	book: Book;
}
const ProductSchema = SchemaFactory.createForClass(CartProduct);

@Schema({
	collection: CART_COLLECTION,
	versionKey: 'version',
	toJSON: {
		virtuals: true,
		transform: (doc, ret) => {
			delete ret._id;
		},
	},
})
export class Cart {
	@Prop({ type: MongooseSchema.Types.ObjectId, ref: USER_COLLECTION })
	user: User;

	@Prop({ type: [ProductSchema] })
	products: CartProduct[];
}

export const CartSchema = SchemaFactory.createForClass(Cart);

CartSchema.virtual('totalPrice').get(function () {
	let sum = 0;
	this.products.forEach(product => {
		const price = calculatePrice(product.book.oldPrice, product.book.discount);
		sum += price * product.amount;
	});
	return sum ?? 0;
});

CartSchema.virtual('id').get(function () {
	return this._id;
});
