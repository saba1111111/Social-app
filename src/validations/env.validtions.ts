import * as Joi from "joi";

export class Config {
	static envVars: object = process.env;

	static envVarsSchema = Joi.object({
		APP_PORT: Joi.number().required(),
		POSTGRES_USER: Joi.string().required(),
		POSTGRES_PORT: Joi.number().required(),
		POSTGRES_PASSWORD: Joi.string().required(),
		POSTGRES_DB: Joi.string().required(),
		POSTGRES_HOST: Joi.string().required(),
		REDIS_HOST: Joi.string().required(),
		REDIS_PORT: Joi.number().required(),
		EMAIL: Joi.string().email().required(),
		EMAIL_PASSWORD: Joi.string().required(),
	}).unknown();

	static ValidateEnvVars() {
		const { error } = this.envVarsSchema.validate(this.envVars);

		if (error) {
			throw new Error(`Config validation error, ${error.message}`);
		}
	}
}
