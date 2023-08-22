import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BOOK_COLLECTION } from '../books.constants';
import { Types } from 'mongoose';

export const Covers = ['hard', 'soft'] as const;
export type CoverType = (typeof Covers)[number];

export const AgeLimits = [6, 12, 16, 18] as const;
export type AgeLimit = (typeof AgeLimits)[number];

export enum SortBookValues {
	PRICE = 'price',
	RATING = 'rating',
}

export enum Order {
	asc = 'asc',
	desc = 'desc',
}

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

	@Prop({ type: Number })
	ageLimit: AgeLimit;

	@Prop()
	oldPrice: number;

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
	{ title: 'text', author: 'text' },
	{ name: 'SearchIndex', weights: { title: 3, author: 2 } },
);

BookSchema.virtual('id').get(function () {
	return this._id.toHexString();
});

BookSchema.virtual('price').get(function () {
	return calculatePrice(this.oldPrice, this.discount);
});

export const calculatePrice = (oldPrice: number, discount: number) => {
	return Math.ceil((oldPrice * (100 - discount)) / 100);
};
