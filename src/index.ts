import "reflect-metadata";
import { Container } from "inversify";
import { config as configDotenv } from "dotenv";
import { Config } from "./validations";
import { InversifyExpressServer } from "inversify-express-utils";
import { setupContainerBindings } from "./utils";
import { Logger } from "./interfaces";
import TOKENS from "./utils/tokens";
import { connectToDbAndBind } from "./utils/Connection";
import * as bodyParser from "body-parser";
import "./controllers/lib/users.controller";

configDotenv();
Config.ValidateEnvVars();

(async () => {
	const container = new Container();
	await setupContainerBindings(container);

	const logger = container.get<Logger>(TOKENS.WINSTON_LOGGER_TOKEN);

	await connectToDbAndBind(container, logger);

	const server = new InversifyExpressServer(container);

	server.setConfig((app) => {
		app.use(
			bodyParser.urlencoded({
				extended: true,
			})
		);
		app.use(bodyParser.json());
	});

	const app = server.build();
	app.listen(process.env.APP_PORT, () => {
		logger.info(`start listening port: ${process.env.APP_PORT}`);
	});
})();
