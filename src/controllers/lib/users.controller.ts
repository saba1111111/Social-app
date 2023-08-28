import { Response, Request } from "express";
import { controller, httpPost } from "inversify-express-utils";
import { validationMiddleware } from "@src/middlewares";
import { loginSchema, registerSchema, verifySchema } from "@src/validations";
import TOKENS from "@src/utils/tokens";
import { HandlerInterface } from "@src/interfaces";
import { UserService } from "@src/services";
import { inject } from "inversify";

@controller("/users")
export class UsersController {
	constructor(
		@inject(TOKENS.USER_SERICE_TOKEN)
		private readonly userService: UserService,
		@inject(TOKENS.HANDLER_SERVICE_TOKEN)
		private readonly handler: HandlerInterface
	) {}

	@httpPost("/register", validationMiddleware(registerSchema))
	public async register(req: Request, res: Response) {
		try {
			const { username, email, password } = req.body;
			const user = await this.userService.registerUser({
				username,
				email,
				password,
			});

			return this.handler.onSuccess(res, {
				message: "Successfully sent OTP on email!",
				email: user.email,
			});
		} catch (error) {
			this.handler.onConflict(res, error, 400);
		}
	}

	@httpPost("/verify", validationMiddleware(verifySchema))
	public async verify(req: Request, res: Response) {
		try {
			const { email, otp } = req.body;
			await this.userService.verify({ email, otp });

			this.handler.onSuccess(res, { message: "Successfully verified!" });
		} catch (error) {
			this.handler.onConflict(res, error, 401);
		}
	}

	@httpPost("/login", validationMiddleware(loginSchema))
	public async login(req: Request, res: Response) {
		try {
			const { email, password } = req.body;
			await this.userService.login({ email, password });

			this.handler.onSuccess(res, { message: "Successfully login!" });
		} catch (error) {
			this.handler.onConflict(res, error, 401);
		}
	}
}
