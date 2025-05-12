import axios from 'axios'

export const repo = axios.create({
	baseURL: import.meta.env.VITE_REPO_URL,
	headers: {
		'Content-Type': 'application/json',
	},
})
