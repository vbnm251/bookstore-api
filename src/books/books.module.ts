import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BOOKS_MODEL } from './books.constants';
import { BookSchema } from './entitites/book.entity';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';

@Module({
	imports: [MongooseModule.forFeature([{ name: BOOKS_MODEL, schema: BookSchema }])],
	controllers: [BooksController],
	providers: [BooksService],
})
export class BooksModule {}
