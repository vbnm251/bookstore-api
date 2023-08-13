import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { BooksModule } from './books/books.module';
import { ReviewsModule } from './reviews/reviews.module';
import { CartModule } from './cart/cart.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getMongoConfig } from './configs/mongo.config';

@Module({
	imports: [
		ConfigModule.forRoot(),
		AuthModule,
		BooksModule,
		ReviewsModule,
		CartModule,
		MongooseModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: getMongoConfig,
		}),
	],
})
export class AppModule {}
