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

		this.client.on("error", (error) => {
			this.logger.error(`Failed connection to redis: ${error.message}`);
		});

		this.client.on("connect", () => {
			this.logger.info("Successfully connect redis!");
		});
	}

	public async add(key: string, value: any): Promise<any>;
	public async add(key: string, value: any, expiration: number): Promise<any>;
	public async add(key: string, value: any, expiration?: number) {
		await this.client.set(key, value);

		if (expiration != undefined) {
			await this.client.expire(key, expiration);
		}
	}

	public async get(key: string) {
		const data = await this.client.get(key);
		return data ? data : null;
	}

	public async remove(key: string) {
		await this.client.del(key);
	}
}
