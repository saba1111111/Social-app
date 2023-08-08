import { Database, Logger } from "@src/interfaces";
import TOKENS from "@src/utils/tokens";
import { inject, injectable } from "inversify";
import pg from "pg";

@injectable()
export class Postgres implements Database {
	private readonly client: pg.Client;

	constructor(
		@inject(TOKENS.WINSTON_LOGGER_TOKEN) private readonly logger: Logger
	) {
		const { PG_USER, PG_PASSWORD, PG_DB, PG_HOST, PG_PORT } = process.env;

		this.client = new pg.Client({
			user: PG_USER,
			password: PG_PASSWORD,
			database: PG_DB,
			host: PG_HOST,
			port: Number(PG_PORT),
		});
	}

	public async connect(): Promise<pg.Client> {
		try {
			await this.client.connect();

			this.logger.info("Successfully connect to postgres!");
		} catch (error) {
			this.logger.error(`Can not connect to postgress: ${error}`);
			process.exit(1);
		}
		return this.client;
	}
}
