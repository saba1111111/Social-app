import Joi from "joi";

export const registerSchema = Joi.object({
	email: Joi.string().email().required(),
	password: Joi.string().min(8).required(),
	username: Joi.string().alphanum().min(3).required(),
});

export const verifySchema = Joi.object({
	email: Joi.string().email().required(),
	otp: Joi.number().required(),
});

export const loginSchema = Joi.object({
	email: Joi.string().email().required(),
	password: Joi.string().min(8).required(),
});
