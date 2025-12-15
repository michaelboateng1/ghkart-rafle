export const htmlMessage = (otp) => {
        return `
        <!-- Preheader (hidden) -->
        <div style="font-family: 'Helvetica Neue', Arial, Helvetica, sans-serif; background-color:#f3f4f6; padding:10px;">
            <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                
                <tr>
                    <td align="center">
                        <table style="max-width:640px; width:100%; background:#ffffff; border-radius:8px; box-shadow:0 4px 12px rgba(16,24,40,0.05);" cellpadding="0" cellspacing="0" role="presentation">
                            <tr>
                                <td style="padding:28px 32px; color:#111827;">
                                    <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                                        <tr>
                                            <td align="center" style="padding: 10px 0 20px 0;">
                                                <!-- logo should be attached with cid:ghkart_logo -->
                                                <img src="cid:ghkart_logo" alt="Ghkart Logo" width="160" style="display:block; border:0;" />
                                            </td>
                                        </tr>
                                    </table>
                                    <h1 style="margin:0 0 10px; font-size:20px; color:#05df72; font-weight:700;">Your ghkart verification code</h1>
                                    <p style="margin:0 0 18px; color:#374151; font-size:15px;">Use the passcode below to complete your sign-in or verification. This code is valid for 10 minutes.</p>

                                    <div style="display:flex; align-items:center; justify-content:center; margin:22px 0;">
                                        <div style="font-weight:700; font-size:28px; letter-spacing:4px; background:#ecfdf0; padding:14px 26px; border-radius:10px; border:1px solid rgba(5,223,114,0.12); color:#06623b;">
                                            ${otp}
                                        </div>
                                    </div>

                                    <p style="color:#4b5563; font-size:12px; margin:0 0 8px;">If you didn't request this code, you can safely ignore this email. For help, reply to this message and our support team will assist.</p>

                                    <p style="color:#6b7280; font-size:12px; margin:18px 0 0;">Warm wishes,<br/><strong style="color:#065f46;">The Ghkart Team</strong></p>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
                <tr>
                    <td align="center" style="padding:16px 0; color:#9ca3af; font-size:12px;">
                        Ghkart • Bringing holiday cheer to your inbox
                    </td>
                </tr>
            </table>
        </div>
        `;
}

export const textMessage = (otp) => {
    return `Ghkart Verification Code\n\nYour one-time passcode is: ${otp}\n\nThis code is valid for 10 minutes. If you did not request this, you can ignore this message.\n\n— The Ghkart Team`;
}