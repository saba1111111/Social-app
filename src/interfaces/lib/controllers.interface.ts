import { Server } from "./server.interface";

export interface Controller {
	registerRoutes(server: Server): void;
}
