export class Error {
	message: string
	stack?: string
	status: number

	constructor(message: string, status?: number, stack?: string) {
        this.message = message;
        this.status = status ?? 500;
        this.stack = stack;
    }
}
