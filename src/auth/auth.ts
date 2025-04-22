import { NextFunction, Request, Response } from 'express'

export function apiKeyAuth(req: Request, res: Response, next: NextFunction) {
	const apiKey = req.header('X-API-KEY')
	if (!apiKey || apiKey !== process.env.API_KEY) {
		res.status(401).json({ message: 'Invalid or missing API key' })
		return
	}
	next()
}
