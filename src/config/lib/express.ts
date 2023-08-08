import { Server } from "@src/interfaces";
import { Application } from "express";
import { injectable } from "inversify";
import express from "express";

@injectable()
export class ExpressServer implements Server {
	private readonly server: Application;

	constructor() {
		this.server = express();
		this.server.use(express.json());
	}

	public listen(port: number, cb: () => void) {
		this.server.listen(port, cb);
	}

	public get(path: string, ...cb: any) {
		this.server.get(path, cb);
	}

	public post(path: string, ...cb: any) {
		this.server.post(path, cb);
	}

	public put(path: string, ...cb: any) {
		this.server.put(path, cb);
	}

	public delete(path: string, ...cb: any) {
		this.server.delete(path, cb);
	}
}
