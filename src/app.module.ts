import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { CartModule } from './cart/cart.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getMongoConfig } from './configs/mongo.config';
import { BooksModule } from './books/books.module';
import { ReviewsModule } from './reviews/reviews.module';
import { CommonModule } from './common';

@Module({
	imports: [
		ConfigModule.forRoot(),
		CartModule,
		MongooseModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: getMongoConfig,
		}),
		CommonModule,
		AuthModule,
		BooksModule,
		ReviewsModule,
	],
})
export class AppModule {}
