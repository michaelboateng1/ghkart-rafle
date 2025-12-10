import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Load .env when running locally so process.env.GMAIL_USER etc. are available
dotenv.config();

export async function sendEmail({ to, subject, text, html }) {
	try {
		let transporter;

		// If user provided Gmail credentials, use them.
		transporter = nodemailer.createTransport({
			service: 'gmail',
			auth: {
				user: process.env.GMAIL_USER,
				pass: process.env.GOOGLE_APP_PASSWORD
			}
		});

		const mailOptions = {
			from: process.env.GMAIL_USER || 'no-reply@example.com',
			to,
			subject,
			text,
			html
		};

		console.log(`Sending mail to ${to} with subject "${subject}"`);
		const info = await transporter.sendMail(mailOptions);

		// If using Ethereal (test account), print preview URL
		if (nodemailer.getTestMessageUrl && nodemailer.getTestMessageUrl(info)) {
			console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
		}

		console.log('Message sent: %s', info.messageId || '[no-message-id]');
		return info;
	} catch (err) {
		console.error('Error sending email:', err && err.stack ? err.stack : err);
		throw err;
	}
}
