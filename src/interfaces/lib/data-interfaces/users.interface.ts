export interface User {
	id?: number;
	username: string;
	email: string;
	password: string;
	created_at?: Date;
	update_at?: Date;
	authorized: boolean;
}

export interface verifyUserService {
	email: string;
	otp: number;
}

export interface verifyUserRepository {
	email: string;
	status: boolean;
}
