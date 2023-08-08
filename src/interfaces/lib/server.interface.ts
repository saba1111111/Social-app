export interface Server {
	listen(port: number, ...args: any): void;

	get(path: string, ...args: any): void;
	post(path: string, args: any): void;
	delete(path: string, args: any): void;
	put(path: string, args: any): void;
}
