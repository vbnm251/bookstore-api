import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CartSchema } from './entities';
import { CART_MODEL } from './cart.constants';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { BOOKS_MODEL } from 'src/books/books.constants';
import { BookSchema } from 'src/books/entitites';

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: CART_MODEL, schema: CartSchema },
			{ name: BOOKS_MODEL, schema: BookSchema },
		]),
	],
	providers: [CartService],
	controllers: [CartController],
})
export class CartModule {}
