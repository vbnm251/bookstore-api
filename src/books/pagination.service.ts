import { Injectable } from '@nestjs/common';
import { Request, Response } from 'express';
import { PaginationResponse } from 'src/responses/pagination.response';

@Injectable()
export class PaginationService {
	static isPagination(data: any): data is PaginationResponse {
		return (
			data !== undefined && (data as PaginationResponse).pagination !== undefined
		);
	}

	async setXTotalHeaders(
		res: Response,
		req: Request,
		values: Omit<PaginationResponse, 'data'>,
		page: number,
		limit: number,
	) {
		console.log(values);

		const link = await this.generateLinkHeader(
			req,
			values.pagination.totalPages,
			page,
			limit,
		);
		return res
			.set('X-Total-Pages', String(values.pagination.totalPages))
			.set('X-Total-Count', String(values.pagination.totalCount))
			.set('X-Current-Page', String(page))
			.set('Link', link);
	}

	private async generateLinkHeader(
		req: Request,
		totalPages: number,
		currentPage: number,
		limit: number,
	) {
		const linkHeader: string[] = [];

		if (currentPage > 1) {
			linkHeader.push(
				await this.generateLinkUrl(req, currentPage - 1, limit, 'prev'),
			);
		}
		if (currentPage < totalPages) {
			linkHeader.push(
				await this.generateLinkUrl(req, currentPage + 1, limit, 'next'),
			);
		}
		linkHeader.push(await this.generateLinkUrl(req, 1, limit, 'first'));
		linkHeader.push(await this.generateLinkUrl(req, totalPages, limit, 'last'));

		return linkHeader.join(', ');
	}

	private async generateLinkUrl(
		req: Request,
		page: number,
		limit: number,
		rel: string,
	) {
		//TODO: add all query and change only page
		return `<${req.protocol}://${req.get(
			'Host',
		)}/api/books?page=${page}&limit=${limit}>; rel="${rel}"`;
	}
}
