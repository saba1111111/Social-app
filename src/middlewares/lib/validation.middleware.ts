import { Response, Request, NextFunction } from "express";
import Joi from "joi";

export const validationMiddleware = (schema: Joi.ObjectSchema) => {
	return (req: Request, res: Response, next: NextFunction) => {
		const { error } = schema.validate(req.body);

		if (error) {
			const message = error.details[0].message;
			return res
				.status(422)
				.json({ result: { status: "Failed", data: { message } } });
		}

		next();
	};
};
