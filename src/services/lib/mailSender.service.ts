import { MessageSender } from "@src/interfaces";
import { injectable } from "inversify";
import * as nodemailer from "nodemailer";

@injectable()
export class MailSender implements MessageSender {
	private transporter: nodemailer.Transporter;

	constructor() {
		this.transporter = nodemailer.createTransport({
			service: "Gmail",
			auth: {
				user: process.env.EMAIL,
				pass: process.env.EMAIL_PASSWORD,
			},
		});
	}

	async sendMessage(
		to: string,
		topic: string,
		message: string
	): Promise<any> {
		const mailOptions: nodemailer.SendMailOptions = {
			from: process.env.EMAIL,
			to,
			subject: topic,
			text: message,
		};
		await this.transporter.sendMail(mailOptions);
	}
}
