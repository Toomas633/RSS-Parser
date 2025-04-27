import express, { Request, Response, NextFunction } from 'express'
import cors from 'cors'
import { setupSwagger } from './swagger'
import routes from '@/routes/routes'
import { Error } from '@/models/error.model'
import dotenv from 'dotenv'
import { apiKeyAuth } from '@/auth/auth'
import { initDataFolder, initEnv } from './init'

dotenv.config()

initEnv()
initDataFolder()

const app = express()
const port = 3000

app.use(cors())
app.use(express.json())

setupSwagger(app)

app.use('/api', apiKeyAuth, routes)

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
	res.status(err.status ?? 500).json({
		message: err.message ?? 'Internal Server Error',
		status: err.status ?? 500,
		stack: err.stack,
	})
})

app.listen(port, () => {
	console.info(`Server is running on http://localhost:${port}/api`)
	console.info(`Swagger docs available at http://localhost:${port}/api-docs`)
})
