export interface CacheMemory {
	add(key: string, value: any): Promise<any>;
	add(key: string, value: any, expiration: number): Promise<any>;
	get(key: string): Promise<any>;
	remove(key: string): Promise<any>;
}
