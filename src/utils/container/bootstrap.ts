import { Container } from "inversify";
import { Redis } from "@src/config";
import {
	CacheMemory,
	HandlerInterface,
	Logger,
	MessageSender,
	SecurityService,
	UserRepositoryInterface,
} from "@src/interfaces";
import TOKENS from "../tokens";
import { Handler, MailSender, UserService, WinstonLogger } from "@src/services";
import { UserRepository } from "@src/repositories";
import { CryptoService } from "@src/services";

export async function setupContainerBindings(container: Container) {
	container
		.bind<Logger>(TOKENS.WINSTON_LOGGER_TOKEN)
		.to(WinstonLogger)
		.inSingletonScope();

	container
		.bind<CacheMemory>(TOKENS.REDIS_TOKEN)
		.to(Redis)
		.inSingletonScope();

	container
		.bind<UserRepositoryInterface>(TOKENS.USER_REPOSITORY_TOKEN)
		.to(UserRepository)
		.inSingletonScope();

	container
		.bind<UserService>(TOKENS.USER_SERICE_TOKEN)
		.to(UserService)
		.inSingletonScope();

	container
		.bind<HandlerInterface>(TOKENS.HANDLER_SERVICE_TOKEN)
		.to(Handler)
		.inSingletonScope();

	container
		.bind<SecurityService>(TOKENS.CRYPTO_SERVICE_TOKEN)
		.to(CryptoService)
		.inSingletonScope();

	container
		.bind<MessageSender>(TOKENS.MAIL_SENDING_SERVICE)
		.to(MailSender)
		.inSingletonScope();
}
