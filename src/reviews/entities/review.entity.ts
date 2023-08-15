import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema, Types } from 'mongoose';
import { USER_COLLECTION } from 'src/auth/auth.constants';
import { REVIEW_COLLECTION } from '../review.constants';

@Schema({
	collection: REVIEW_COLLECTION,
	versionKey: 'version',
	timestamps: true,
})
export class Review {
	@Prop()
	title: string;

	@Prop({ required: true })
	body: string;

	@Prop()
	advantages?: string;

	@Prop()
	disadvantages?: string;

	@Prop()
	rating: number;

	@Prop({ type: MongooseSchema.Types.ObjectId, ref: USER_COLLECTION })
	userId: Types.ObjectId;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);
