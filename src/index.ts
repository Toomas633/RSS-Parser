import express, { Request, Response, NextFunction } from 'express'
import { setupSwagger } from '@/swagger'
import routes from '@/routes/routes'
import { Error } from '@/models/error.model'
import dotenv from 'dotenv'
import { apiKeyAuth } from './auth/auth'

dotenv.config()

const app = express()
const port = process.env.PORT ?? 3000

app.use(express.json())

setupSwagger(app)

app.use('/api', apiKeyAuth, routes)

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
	res.status(err.status ?? 500).json({
		message: err.message ?? 'Internal Server Error',
		status: err.status ?? 500,
	})
})

app.listen(port, () => {
	console.info(`Server is running on http://localhost:${port}/api`)
	console.info(`Swagger docs available at http://localhost:${port}/api-docs`)
})
