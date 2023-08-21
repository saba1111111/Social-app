import { User, verifyUserRepository } from "@src/interfaces";

export interface UserRepositoryInterface {
	findOneByEmail(email: string): Promise<User>;
	insertUser(user: User): Promise<any>;
	changeUserVerifiedStatus(data: verifyUserRepository): Promise<any>;
}
