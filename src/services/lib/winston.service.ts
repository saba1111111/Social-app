import { Logger } from "@src/interfaces";
import { injectable } from "inversify";
import winston from "winston";

@injectable()
export class WinstonLogger implements Logger {
	private readonly logger: any;

	constructor() {
		this.logger = winston.createLogger({
			transports: [
				new winston.transports.Console({
					level: "info",
				}),
			],
			format: winston.format.combine(
				winston.format.colorize(),
				winston.format.simple()
			),
		});
	}

	public info(message: string) {
		this.logger.info(message);
	}

	public error(message: string) {
		this.logger.error(message);
	}

	public warn(message: string) {
		this.logger.warn(message);
	}

	public debug() {
		this.logger.debug("sbss");
	}
}
