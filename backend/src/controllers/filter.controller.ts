import { FilterService } from '@/services/filter.service'
import { Request, Response } from 'express'

export class FilterController {
	constructor(private readonly filterService: FilterService) {}

	public getFilters(_req: Request, res: Response) {
		res.send(this.filterService.getFilters())
	}

	public getFilter(req: Request, res: Response) {
		const filter = this.filterService.getFilters(
			parseInt(req.params.feedId, 10)
		)
		if (filter) {
			res.status(200).send(filter[0])
		} else {
			res.status(404).send({ message: 'Filter not found' })
		}
	}

	public addFilter(req: Request, res: Response) {
		res.send(this.filterService.addFilter(req.body))
	}

	public deleteFilter(req: Request, res: Response) {
		const feedId = parseInt(req.params.feedId, 10)
		this.filterService.deleteFilter(feedId)
		res.send(this.filterService.deleteFilter(feedId))
	}

	public editFilter(req: Request, res: Response) {
		const feedId = parseInt(req.params.feedId, 10)
		res.send(this.filterService.editFilter(feedId, req.body))
	}
}
