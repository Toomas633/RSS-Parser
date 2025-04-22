import swaggerUi from 'swagger-ui-express'
import { Express } from 'express'
import YAML from 'yamljs'
import * as fs from 'fs'
import path from 'path'

function getAllYamlFiles(dir: string): string[] {
	const files = fs.readdirSync(dir)
	let yamlFiles: string[] = []
	for (const file of files) {
		const fullPath = path.join(dir, file)
		const stat = fs.statSync(fullPath)
		if (stat.isDirectory()) {
			yamlFiles = yamlFiles.concat(getAllYamlFiles(fullPath))
		} else if (file.endsWith('.yaml') || file.endsWith('.yml')) {
			yamlFiles.push(fullPath)
		}
	}
	return yamlFiles
}

function deepMerge(
	target: Record<string, unknown>,
	source: Record<string, unknown>
) {
	for (const key of Object.keys(source)) {
		const sourceValue = source[key]
		const targetValue = target[key]
		if (
			sourceValue &&
			typeof sourceValue === 'object' &&
			!Array.isArray(sourceValue)
		) {
			if (
				!targetValue ||
				typeof targetValue !== 'object' ||
				Array.isArray(targetValue)
			) {
				target[key] = {}
			}
			deepMerge(
				target[key] as Record<string, unknown>,
				sourceValue as Record<string, unknown>
			)
		} else {
			target[key] = sourceValue
		}
	}
	return target
}

const docsDir = path.resolve(__dirname, '../docs')
const yamlFiles = getAllYamlFiles(docsDir)

let swaggerSpec: Record<string, unknown> = {}
for (const yamlFile of yamlFiles) {
	const doc = YAML.load(yamlFile)
	swaggerSpec = deepMerge(swaggerSpec, doc)
}

export const setupSwagger = (app: Express): void => {
	app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
}
