'use server';

import { dbService } from '@/lib/db';
import { contactSchema } from '@/lib/validations';
import { headers } from 'next/headers';

// Simple in-memory sliding window rate-limiter for contact submissions (max 3 per IP per 5 minutes)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export async function submitContactFormAction(prevState: any, formData: FormData) {
  const headerList = await headers();
  const ip = headerList.get('x-forwarded-for') || headerList.get('x-real-ip') || 'local-ip';

  // Check rate limit
  const now = Date.now();
  const rateRecord = rateLimitMap.get(ip);
  if (rateRecord) {
    if (now < rateRecord.resetTime) {
      if (rateRecord.count >= 4) {
        return {
          success: false,
          error: 'Too many messages sent. Please wait a few minutes before trying again.',
        };
      }
      rateRecord.count++;
    } else {
      rateLimitMap.set(ip, { count: 1, resetTime: now + 5 * 60 * 1000 });
    }
  } else {
    rateLimitMap.set(ip, { count: 1, resetTime: now + 5 * 60 * 1000 });
  }

  const rawData = {
    name: formData.get('name') as string,
    email: formData.get('email') as string,
    subject: formData.get('subject') as string,
    message: formData.get('message') as string,
    honeypot: formData.get('website_url') as string, // Honeypot field
  };

  // Antispam honeypot trap: if bot fills this hidden field, silently succeed without storing
  if (rawData.honeypot && rawData.honeypot.trim() !== '') {
    return {
      success: true,
      message: 'Thank you! Your message has been sent successfully.',
    };
  }

  const validation = contactSchema.safeParse(rawData);
  if (!validation.success) {
    return {
      success: false,
      error: validation.error.errors[0]?.message || 'Please fill in all fields correctly.',
    };
  }

  try {
    await dbService.createMessage({
      name: rawData.name,
      email: rawData.email,
      subject: rawData.subject,
      message: rawData.message,
      ipHash: ip.slice(0, 15),
    });

    return {
      success: true,
      message: "Thank you for reaching out! I'll get back to you promptly.",
    };
  } catch (error: any) {
    return {
      success: false,
      error: 'An unexpected error occurred while sending your message. Please try again or email directly.',
    };
  }
}
