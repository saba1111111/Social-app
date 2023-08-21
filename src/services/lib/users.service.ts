import {
	CacheMemory,
	MessageSender,
	SecurityService,
	User,
	UserRepositoryInterface,
} from "@src/interfaces";
import TOKENS from "@src/utils/tokens";
import { inject, injectable } from "inversify";
import { Logger } from "winston";
import { verifyUserService } from "@src/interfaces";

@injectable()
export class UserService {
	constructor(
		@inject(TOKENS.WINSTON_LOGGER_TOKEN) private readonly logger: Logger,
		@inject(TOKENS.USER_REPOSITORY_TOKEN)
		private readonly userRepository: UserRepositoryInterface,
		@inject(TOKENS.CRYPTO_SERVICE_TOKEN)
		private readonly securityService: SecurityService,
		@inject(TOKENS.REDIS_TOKEN) private readonly cacheMemory: CacheMemory,
		@inject(TOKENS.MAIL_SENDING_SERVICE)
		private readonly messageSender: MessageSender
	) {}

	public async registerUser(user: User) {
		const { email } = user;

		const userExists = Boolean(
			await this.userRepository.findOneByEmail(email)
		);
		if (userExists) {
			throw new Error("Email is invalid or already taken!");
		}

		const hashedPassword = await this.securityService.hashPassword(
			user.password
		);

		await this.userRepository.insertUser({
			...user,
			password: hashedPassword,
		});

		const OTP = this.securityService.generateOtpVerificationCode();
		await this.cacheMemory.add(email, OTP, 300000);
		await this.messageSender.sendMessage(
			email,
			"Otp Verification",
			`${OTP}`
		);

		return { email };
	}

	public async verify(data: verifyUserService) {
		const { email, otp } = data;

		const otpInCache = await this.cacheMemory.get(email);
		if (!otpInCache || Number(otpInCache) !== otp) {
			throw new Error("Faild to verify user!");
		}

		await this.cacheMemory.remove(email);

		await this.userRepository.changeUserVerifiedStatus({
			email,
			status: true,
		});
	}
}
