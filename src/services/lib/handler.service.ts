import { inject, injectable } from "inversify";
import { Response } from "express";
import { HandlerInterface, Logger } from "@src/interfaces";
import TOKENS from "@src/utils/tokens";

@injectable()
export class Handler implements HandlerInterface {
	constructor(
		@inject(TOKENS.WINSTON_LOGGER_TOKEN) private readonly logger: Logger
	) {}

	public onSuccess(res: Response, data: object, statusCode: number = 200) {
		return res
			.status(statusCode)
			.json({ result: { status: "success", data } });
	}

	public onConflict(
		res: Response,
		error: string | Error,
		statusCode: number = 500
	) {
		const message = error instanceof Error ? error.message : error;
		this.logger.error(message);
		return res
			.status(statusCode)
			.json({ result: { status: "Failed", data: { message } } });
	}
}
