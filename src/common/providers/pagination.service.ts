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
	) {
		const link = await this.generateLinkHeader(
			req,
			values.pagination.totalPages,
			page,
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
	) {
		const linkHeader: string[] = [];

		if (currentPage > 1) {
			linkHeader.push(await this.generateLinkUrl(req, currentPage - 1, 'prev'));
		}
		if (currentPage < totalPages) {
			linkHeader.push(await this.generateLinkUrl(req, currentPage + 1, 'next'));
		}
		linkHeader.push(await this.generateLinkUrl(req, 1, 'first'));
		linkHeader.push(await this.generateLinkUrl(req, totalPages, 'last'));

		return linkHeader.join(', ');
	}

	private async generateLinkUrl(req: Request, page: number, rel: string) {
		const url = new URL(`${req.protocol}://${req.get('Host')}${req.originalUrl}`);
		url.searchParams.set('page', String(page));
		return `<${url.toString()}>; rel="${rel}"`;
	}
}
