import { Response } from "express";

export interface HandlerInterface {
	onSuccess(response: Response, data: any, statusCode?: number): void;
	onConflict(response: Response, data: any, statusCode?: number): void;
}
