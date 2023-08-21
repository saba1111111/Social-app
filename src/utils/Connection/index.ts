import { Container } from "inversify";
import TOKENS from "../tokens";
import { Logger } from "@src/interfaces";
import { Postgres } from "@src/config";
import pg from "pg";

export async function connectToDbAndBind(container: Container, logger: Logger) {
	const db = new Postgres(logger);

	const client = await db.connect();

	container
		.bind<pg.Client>(TOKENS.DB_CONNECTION_TOKEN)
		.toConstantValue(client);
}
