import { Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { REVIEW_MODEL } from './review.constants';
import { ReviewSchema } from './entities/review.entity';

@Module({
	imports: [MongooseModule.forFeature([{ name: REVIEW_MODEL, schema: ReviewSchema }])],
	controllers: [ReviewsController],
	providers: [ReviewsService],
})
export class ReviewsModule {}
