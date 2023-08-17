import { Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { REVIEW_MODEL } from './review.constants';
import { ReviewSchema } from './entities/review.entity';
import { USER_MODEL } from 'src/auth/auth.constants';
import { UserSchema } from 'src/auth/entities/user.entity';

@Module({
	imports: [
		MongooseModule.forFeature([{ name: REVIEW_MODEL, schema: ReviewSchema }]),
		MongooseModule.forFeature([{ name: USER_MODEL, schema: UserSchema }]),
	],
	controllers: [ReviewsController],
	providers: [ReviewsService],
})
export class ReviewsModule {}
