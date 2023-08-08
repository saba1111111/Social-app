export interface Database {
	connect(): Promise<NonNullable<any>>;
}
