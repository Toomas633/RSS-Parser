import { NextFunction, Request, Response } from 'express'

export function apiKeyAuth(req: Request, res: Response, next: NextFunction) {
	const apiKey = req.header('X-API-KEY')
	console.log(`API Key: ${apiKey}`)
	console.log(`Expected: ${process.env.API_KEY}`)
	if (!apiKey || apiKey !== process.env.API_KEY) {
		return res.status(401).json({ message: 'Invalid or missing API key' })
	}
	next()
}
