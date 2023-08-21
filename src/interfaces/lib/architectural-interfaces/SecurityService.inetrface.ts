export interface SecurityService {
	hashPassword(payload: string, saltValue?: number): Promise<string>;
	comparePassword(password: string, hashedPassword: string): Promise<boolean>;
	generateOtpVerificationCode(): number;
}
