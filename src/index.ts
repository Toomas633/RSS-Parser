import express, { NextFunction } from 'express'
import { setupSwagger } from '@/swagger'
import routes from '@/routes/routes'
import { ErrorResponse } from '@/models/error'

const app = express()
const port = 3000

app.use(express.json())

setupSwagger(app)

app.use('/', routes)

app.use(
	(
		err: ErrorResponse,
		_req: express.Request,
		res: express.Response,
		next: NextFunction
	) => {
		res.status(err.status || 500).json({
			message: err.message || 'Internal Server Error',
			status: err.status || 500,
		})
	}
)

app.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}`)
	console.log(`Swagger docs available at http://localhost:${port}/api-docs`)
})
