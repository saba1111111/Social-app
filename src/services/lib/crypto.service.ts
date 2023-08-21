import { SecurityService } from "@src/interfaces";
import { genSalt, hash, compare } from "bcrypt";
import { injectable } from "inversify";

@injectable()
export class CryptoService implements SecurityService {
	constructor() {}

	async hashPassword(
		payload: string,
		saltValue: number = 10
	): Promise<string> {
		const salt = await genSalt(saltValue);
		return hash(payload, salt);
	}

	async comparePassword(
		password: string,
		hashedPassword: string
	): Promise<boolean> {
		return compare(password, hashedPassword);
	}

	generateOtpVerificationCode(): number {
		return Math.floor(Math.random() * 1000000);
	}
}
