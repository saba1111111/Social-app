import {
	Logger,
	User,
	UserRepositoryInterface,
	verifyUserRepository,
} from "@src/interfaces";
import TOKENS from "@src/utils/tokens";
import { inject, injectable } from "inversify";
import pg from "pg";

@injectable()
export class UserRepository implements UserRepositoryInterface {
	constructor(
		@inject(TOKENS.WINSTON_LOGGER_TOKEN) private readonly logger: Logger,
		@inject(TOKENS.DB_CONNECTION_TOKEN) private readonly client: pg.Client
	) {}

	public async findOneByEmail(email: string): Promise<User> {
		const query = "SELECT * FROM users WHERE email = $1";
		const result = await this.client.query(query, [email]);

		return result.rows[0];
	}

	public async insertUser(user: User): Promise<any> {
		const query =
			"INSERT INTO users(username, email, password) VALUES($1,$2,$3)";
		const values = [user.username, user.email, user.password];

		return this.client.query(query, values);
	}

	public async changeUserVerifiedStatus(
		data: verifyUserRepository
	): Promise<any> {
		const { email, status } = data;

		const query = "UPDATE users SET authorized = $1 WHERE users.email = $2";
		const values = [status, email];

		return this.client.query(query, values);
	}
}
