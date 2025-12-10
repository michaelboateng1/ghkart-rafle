import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from './server/db';

import { sendEmail } from './sendEmail';

import { emailOTP } from 'better-auth/plugins';

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: 'sqlite'
	}),
	emailAndPassword: {
		enabled: true,
		requireEmailVerification: true
	},
	plugins: [
		emailOTP({
			otpLength: 4,
			expiresIn: 60 * 60 * 24,
			allowedAttempts: 3,
			async sendVerificationOTP({ email, otp, type }) {
				console.log('Sending OTP:', { email, otp, type });

				const subject =
					type === 'email-verification' ? 'Verify your email address' : 'Your OTP Code';

				const html = `<p>Your verification code is: <strong>${otp}</strong></p>`;
				const text = `Your verification code is: ${otp}`;

				try {
					await sendEmail({ to: email, subject, text, html });
					console.log('Email sent successfully to:', email);
				} catch (error) {
					console.error('Failed to send email:', error);
					throw error;
				}
			}
		})
	]
});
