import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema, Types } from 'mongoose';
import { USER_COLLECTION } from 'src/auth/auth.constants';
import { REVIEW_COLLECTION } from '../review.constants';
import { BOOK_COLLECTION } from 'src/books/books.constants';
import { User } from 'src/auth/entities/user.entity';
import { Book } from 'src/books/entitites/book.entity';

@Schema({
	collection: REVIEW_COLLECTION,
	versionKey: 'version',
	timestamps: true,
	toJSON: {
		virtuals: true,
		transform: function (doc, ret) {
			delete ret._id;
		},
	},
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
	user: User;

	@Prop({ type: MongooseSchema.Types.ObjectId, ref: BOOK_COLLECTION })
	book: Book;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);

ReviewSchema.virtual('id').get(function () {
	return this._id.toHexString();
});
