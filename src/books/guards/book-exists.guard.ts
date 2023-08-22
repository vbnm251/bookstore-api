import {
	CanActivate,
	ExecutionContext,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BOOKS_MODEL } from 'src/books/books.constants';
import { Book } from 'src/books/entitites';
import { BOOK_DOES_NOT_EXISTS } from '../../cart/cart.constants';

@Injectable()
export class BookExistsGuard implements CanActivate {
	constructor(@InjectModel(BOOKS_MODEL) private readonly booksModel: Model<Book>) {}

	async canActivate(ctx: ExecutionContext) {
		const req = ctx.switchToHttp().getRequest();
		const bookId = req.params.bookId;

		const book = await this.booksModel.findById(bookId);
		if (book) return true;

		throw new NotFoundException(BOOK_DOES_NOT_EXISTS);
	}
}
