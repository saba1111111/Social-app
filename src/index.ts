import "reflect-metadata";
import { Container } from "inversify";
import { bootstrap } from "./utils";
import { config as configDotenv } from "dotenv";
import { App } from "./app";
import { CacheMemory, Logger, Server } from "./interfaces";
import TOKENS from "./utils/tokens";
import { Config } from "./validations";
import { Database } from "./interfaces";

configDotenv();
Config.ValidateEnvVars();

async function main() {
	const container: Container = await bootstrap();

	const server = container.get<Server>(TOKENS.EXPRESS_SERVER_TOKEN);
	const database = container.get<Database>(TOKENS.POSTGRES_TOKEN);
	const cacheMemory = container.get<CacheMemory>(TOKENS.REDIS_TOKEN);
	const logger = container.get<Logger>(TOKENS.WINSTON_LOGGER_TOKEN);

	cacheMemory.add();
	cacheMemory.get();

	const app = new App(container, server, database, cacheMemory, logger);

	app.init();
}

main();
