import swaggerUi from 'swagger-ui-express'
import { Express } from 'express'
import YAML from 'yamljs'

const swaggerSpec = YAML.load('docs/swagger.yaml')

export const setupSwagger = (app: Express): void => {
	app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
}
