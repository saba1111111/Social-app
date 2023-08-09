import { Container, inject } from "inversify";
import { Controller } from "./interfaces";
import { CacheMemory, Database, Logger, Server } from "./interfaces";
import TOKENS from "./utils/tokens";
import { UsersController } from "./controllers";
import pg from "pg";

export class App {
	private readonly controllers: Array<Controller>;

	constructor(
		@inject(Container) private readonly container: Container,
		@inject(TOKENS.EXPRESS_SERVER_TOKEN) private readonly server: Server,
		@inject(TOKENS.POSTGRES_TOKEN) private database: Database,
		@inject(TOKENS.REDIS_TOKEN) private readonly cacheMemory: CacheMemory,
		@inject(TOKENS.WINSTON_LOGGER_TOKEN) private readonly logger: Logger
	) {
		this.controllers = new Array<Controller>();
	}

	public async init() {
		const dbConnection = await this.database.connect();
		this.container
			.bind<pg.Client>(TOKENS.DB_CONNECTION_TOKEN)
			.toConstantValue(dbConnection);

		await this.cacheMemory.connect();

		this.initializationControllers();

		this.server.listen(Number(process.env.APP_PORT), () => {
			this.logger.info(
				`Server is listening on port: ${process.env.APP_PORT}!`
			);
		});
	}

	public initializationControllers() {
		const userController = new UsersController(this.logger);
		this.controllers.push(userController);

		this.registerControllers();
	}

	public registerControllers() {
		for (const controller of this.controllers) {
			controller.registerRoutes(this.server);
		}
	}
}
