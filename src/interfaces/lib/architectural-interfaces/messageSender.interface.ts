export interface MessageSender {
	sendMessage(to: string, topic: string, message: string): Promise<any>;
}
