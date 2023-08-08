import { Container } from "inversify";
import { ExpressServer, Redis } from "@src/config";
import { CacheMemory, Database, Logger, Server } from "@src/interfaces";
import TOKENS from "../tokens";
import { Postgres } from "@src/config/lib/postgres";
import { WinstonLogger } from "@src/services";

export async function bootstrap(): Promise<Container> {
	return new Promise((resolve, reject) => {
		try {
			const container = new Container();

			container
				.bind<Server>(TOKENS.EXPRESS_SERVER_TOKEN)
				.to(ExpressServer)
				.inSingletonScope();

			container
				.bind<Database>(TOKENS.POSTGRES_TOKEN)
				.to(Postgres)
				.inSingletonScope();

			container
				.bind<CacheMemory>(TOKENS.REDIS_TOKEN)
				.to(Redis)
				.inSingletonScope();

			container
				.bind<Logger>(TOKENS.WINSTON_LOGGER_TOKEN)
				.to(WinstonLogger)
				.inSingletonScope();

			resolve(container);
		} catch (error) {
			reject(new Error("Failed to bootstrap: " + error));
		}
	});
}
