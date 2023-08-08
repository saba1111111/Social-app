export interface CacheMemory {
	connect(): Promise<any>;
	add(): void;
	get(): void;
}
