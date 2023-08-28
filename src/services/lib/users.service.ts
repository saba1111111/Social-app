import * as TYPES from "@src/interfaces";
import TOKENS from "@src/utils/tokens";
import { inject, injectable } from "inversify";
import { Logger } from "winston";

@injectable()
export class UserService {
	constructor(
		@inject(TOKENS.WINSTON_LOGGER_TOKEN) private readonly logger: Logger,
		@inject(TOKENS.USER_REPOSITORY_TOKEN)
		private readonly userRepository: TYPES.UserRepositoryInterface,
		@inject(TOKENS.CRYPTO_SERVICE_TOKEN)
		private readonly securityService: TYPES.SecurityService,
		@inject(TOKENS.REDIS_TOKEN)
		private readonly cacheMemory: TYPES.CacheMemory,
		@inject(TOKENS.MAIL_SENDING_SERVICE)
		private readonly messageSender: TYPES.MessageSender
	) {}

	public async registerUser(user: TYPES.User) {
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

		await this.generateAndSendOtp({
			email,
			messageText: "Otp Verification",
			OtpDuration: 300000,
		});

		return { email };
	}

	public async verify(credentials: TYPES.verifyUserService) {
		const { email, otp } = credentials;

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

	public async login(credentials: TYPES.loginUser) {
		const { email } = credentials;

		const user = await this.userRepository.findOneByEmail(email);
		if (!user) {
			throw new Error("No such user!");
		}

		// if exist and autorize = false, do verify otp again

		// gwnwrate access and refresh tokens and send back

		// return successfully

		return credentials;
	}

	public async generateAndSendOtp(credentials: {
		email: string;
		messageText: string;
		OtpDuration: number;
	}) {
		const { email, OtpDuration, messageText } = credentials;

		const OTP = this.securityService.generateOtpVerificationCode();
		await this.cacheMemory.add(email, OTP, OtpDuration);
		await this.messageSender.sendMessage(email, messageText, `${OTP}`);
	}
}
