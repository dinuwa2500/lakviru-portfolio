/**
 * Simple HTTP-based Email Dispatcher (No Nodemailer / No SMTP credentials)
 * Sends notification emails directly to your Gmail using Web3Forms / Resend HTTP REST API.
 */

interface SendContactEmailParams {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export async function sendEmailNotification({
  name,
  email,
  subject,
  message,
}: SendContactEmailParams): Promise<{ success: boolean; provider?: string; error?: string }> {
  const recipientEmail =
    process.env.CONTACT_NOTIFICATION_EMAIL ||
    process.env.DEFAULT_ADMIN_EMAIL ||
    'dinuwaperera123@gmail.com';

  const web3FormsKey = process.env.WEB3FORMS_ACCESS_KEY;
  const resendApiKey = process.env.RESEND_API_KEY;

  // 1. Web3Forms REST API (Direct Gmail Delivery, Zero Domain Restrictions)
  if (web3FormsKey && web3FormsKey.trim() !== '') {
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          access_key: web3FormsKey.trim(),
          name,
          email,
          subject: `🔔 [Portfolio Inquiry] ${subject} - from ${name}`,
          message: `Sender Name: ${name}\nSender Email: ${email}\nSubject: ${subject}\n\nMessage:\n${message}`,
          from_name: `${name} (Portfolio Contact)`,
          replyto: email,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) {
        console.log('✅ [Email Notification] Dispatched successfully via Web3Forms to your Gmail');
        return { success: true, provider: 'Web3Forms' };
      } else {
        console.error('❌ [Email Notification] Web3Forms response error:', data);
      }
    } catch (err: any) {
      console.error('❌ [Email Notification] Web3Forms network error:', err?.message);
    }
  }

  // 2. Resend REST API (Backup)
  if (resendApiKey && resendApiKey.trim() !== '') {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendApiKey.trim()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Portfolio Contact <onboarding@resend.dev>',
          to: [recipientEmail],
          reply_to: email,
          subject: `🔔 [Portfolio Inquiry] ${subject} - from ${name}`,
          html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e4e4e7; border-radius: 12px; background-color: #ffffff; color: #09090b;">
              <h2 style="color: #4f46e5; margin-top: 0; font-size: 20px;">New Portfolio Inquiry Received</h2>
              <hr style="border: 0; border-top: 1px solid #f4f4f5; margin: 16px 0;" />
              <p style="margin: 6px 0; font-size: 14px;"><strong>From:</strong> ${name} (&lt;<a href="mailto:${email}" style="color: #4f46e5;">${email}</a>&gt;)</p>
              <p style="margin: 6px 0; font-size: 14px;"><strong>Subject:</strong> ${subject}</p>
              
              <div style="background-color: #f8fafc; padding: 18px; border-radius: 8px; border: 1px solid #e2e8f0; margin-top: 16px;">
                <div style="font-size: 12px; font-weight: bold; color: #64748b; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.05em;">Message Content</div>
                <p style="white-space: pre-wrap; margin: 0; color: #1e293b; line-height: 1.6; font-size: 14px;">${message}</p>
              </div>
              
              <hr style="border: 0; border-top: 1px solid #f4f4f5; margin: 24px 0 16px;" />
              <p style="font-size: 12px; color: #71717a; margin: 0;">
                You can reply directly to this email to respond to <strong>${name}</strong> (${email}).
              </p>
            </div>
          `,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        console.log('✅ [Email Notification] Dispatched successfully via Resend');
        return { success: true, provider: 'Resend' };
      } else {
        console.error('❌ [Email Notification] Resend API error:', data);
      }
    } catch (err: any) {
      console.error('❌ [Email Notification] Resend network error:', err?.message);
    }
  }

  return { success: false, error: 'Email dispatch failed across all configured providers.' };
}
