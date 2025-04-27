import { Request, Response } from 'express'
import { FetchService } from '@/services/fetch.service'

export class FetchController {
	constructor(private readonly fetchService: FetchService) {}

	public async fetch(_req: Request, res: Response) {
		res
			.set('Content-Type', 'application/xml')
			.send(await this.fetchService.fetch())
	}

	public async testFetch(req: Request, res: Response) {
		const url = req.body.url
		const result = await this.fetchService.testFetch(url)
		res.send(result)
	}
}
