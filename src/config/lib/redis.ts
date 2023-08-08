import { CacheMemory, Logger } from "@src/interfaces";
import TOKENS from "@src/utils/tokens";
import { inject, injectable } from "inversify";
import { Redis as ioRedis } from "ioredis";

@injectable()
export class Redis implements CacheMemory {
	private readonly client: ioRedis;

	public constructor(
		@inject(TOKENS.WINSTON_LOGGER_TOKEN) private readonly logger: Logger
	) {
		this.client = new ioRedis({
			port: process.env.REDIS_PORT as number | undefined,
			host: process.env.REDIS_HOST as string,
		});
	}

	public async connect() {
		try {
			await this.client.ping();
			this.logger.info("Successfully connect redis!");
		} catch (error) {
			this.logger.error("Failed connection to redis!");
		}
	}

	public add() {
		this.client.set("name", "saba");
	}

	public async get() {
		const data = await this.client.get("name");
		this.logger.info(data);
	}
}
