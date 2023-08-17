import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BOOK_COLLECTION } from '../books.constants';
import { Types } from 'mongoose';

export const COVERS = ['hard', 'soft'] as const;
export type CoverType = (typeof COVERS)[number];

export class Size {
	width: number;
	height: number;
	length: number;
}

@Schema({
	collection: BOOK_COLLECTION,
	timestamps: true,
	versionKey: 'version',
	toJSON: {
		virtuals: true,
		transform: function (doc, ret) {
			delete ret._id;
		},
	},
})
export class Book {
	_id: Types.ObjectId;

	@Prop()
	title: string;

	@Prop()
	author: string;

	@Prop()
	titleImage?: string;

	@Prop()
	images: string[];

	@Prop()
	description: string;

	@Prop()
	genres: string[];

	@Prop()
	publishment: string;

	@Prop()
	publichYear: number;

	@Prop()
	ageLimit: number;

	@Prop()
	price: number;

	@Prop()
	discount?: number;

	@Prop({ type: Size })
	size: Size;

	@Prop()
	pages: number;

	@Prop()
	weight: number;

	@Prop({ type: String })
	coverType: CoverType;
}

export const BookSchema = SchemaFactory.createForClass(Book);

BookSchema.index(
	{ title: 'text', author: 'text', description: 'text' },
	{ name: 'SearchIndex', weights: { title: 3, author: 2, description: 1 } },
);

BookSchema.virtual('id').get(function () {
	return this._id.toHexString();
});

BookSchema.virtual('calculatedPrice').get(function () {
	return Math.ceil((this.price * (100 - this.discount)) / 100);
});
