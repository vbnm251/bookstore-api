import { Types } from 'mongoose';

export class ReviewModel {
	name: string;
	title: string;
	body: string;
	advantages: string;
	disadvantages: string;
	rating: number;
	bookId: Types.ObjectId;
}
