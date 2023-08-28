import { Database, Logger } from "@src/interfaces";
import TOKENS from "@src/utils/tokens";
import { inject } from "inversify";
import pg from "pg";

export class Postgres implements Database {
	private readonly client: pg.Client;

	constructor(
		@inject(TOKENS.WINSTON_LOGGER_TOKEN) private readonly logger: Logger
	) {
		const {
			POSTGRES_USER,
			POSTGRES_PASSWORD,
			POSTGRES_DB,
			POSTGRES_HOST,
			POSTGRES_PORT,
		} = process.env;

		this.client = new pg.Client({
			user: POSTGRES_USER,
			password: POSTGRES_PASSWORD,
			database: POSTGRES_DB,
			host: POSTGRES_HOST,
			port: Number(POSTGRES_PORT),
		});
	}

	public async connect(): Promise<pg.Client> {
		try {
			await this.client.connect();

			this.logger.info("Successfully connect to postgres!");

			return this.client;
		} catch (error) {
			this.logger.error(`Can not connect to postgress: ${error}`);
			process.exit(1);
		}
	}
}
