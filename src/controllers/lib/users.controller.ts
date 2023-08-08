import { Logger, Server } from "@src/interfaces";
import TOKENS from "@src/utils/tokens";
import { inject } from "inversify";
import { Response, Request } from "express";
import { validationMiddleware } from "@src/middlewares/validation.middleware";
import { registerSchema } from "@src/validations";

export class UsersController {
	constructor(
		@inject(TOKENS.WINSTON_LOGGER_TOKEN) private readonly logger: Logger
	) {}

	public registerRoutes(server: Server) {
		server.post("/register", [
			validationMiddleware(registerSchema),
			this.register.bind(this),
		]);
	}

	public async register(req: Request, res: Response) {
		this.logger.info("Successfully registred");
		res.send("Successfully registred");
	}
}
