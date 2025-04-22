import { FilterController } from '@/controllers/filter.controller'
import { FilterService } from '@/services/filter.service'
import { Router } from 'express'

const routes = Router()
const filterController = new FilterController(new FilterService())

routes.get('/', filterController.getFilters.bind(filterController))
routes.put('/', filterController.addFilter.bind(filterController))
routes.get('/:feedId', filterController.getFilter.bind(filterController))
routes.post('/:feedId', filterController.editFilter.bind(filterController))
routes.delete('/:feedId', filterController.deleteFilter.bind(filterController))

export default routes
