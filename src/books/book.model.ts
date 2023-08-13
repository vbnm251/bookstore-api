export type CoverType = 'Мягкий ' | 'Твердый';
export type CoverInfo = `${CoverType} переплет`;

export interface Size {
	width: number;
	height: number;
}

export class BookModel {
	title: string;
	author: string;
	description: string;
	publisher: string;
	price: number;
	discount?: number;
	weight: number;

	publishYear: number;
	images: string[];
	genres: string[];
	pages: number;
	cover: CoverInfo;
	ageLimit: number;
	size: Size;
}
