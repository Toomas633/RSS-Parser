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

function deepMerge(target: any, source: any): any {
	for (const key of Object.keys(source)) {
		if (
			source[key] &&
			typeof source[key] === 'object' &&
			!Array.isArray(source[key])
		) {
			target[key] ??= {}
			deepMerge(target[key], source[key])
		} else {
			target[key] = source[key]
		}
	}
	return target
}

const docsDir = path.resolve(__dirname, '../docs')
const yamlFiles = getAllYamlFiles(docsDir)

let swaggerSpec: any = {}
for (const yamlFile of yamlFiles) {
	const doc = YAML.load(yamlFile)
	swaggerSpec = deepMerge(swaggerSpec, doc)
}

export const setupSwagger = (app: Express): void => {
	app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
}
