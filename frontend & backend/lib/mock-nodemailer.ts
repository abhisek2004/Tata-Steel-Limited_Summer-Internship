/**
 * Mock implementation of nodemailer for development purposes
 * This file provides a simple mock of the nodemailer functionality
 * to avoid dependency issues during build
 */

export interface SendMailOptions {
  from?: string;
  to?: string | string[];
  cc?: string | string[];
  bcc?: string | string[];
  subject?: string;
  text?: string;
  html?: string;
  [key: string]: any;
}

export interface Transporter {
  sendMail(mailOptions: SendMailOptions): Promise<any>;
}

export function createTransport(): Transporter {
  return {
    sendMail: async (mailOptions: SendMailOptions) => {
      console.log('MOCK EMAIL SENT:', mailOptions);
      return {
        messageId: `mock-email-${Date.now()}@example.com`,
        response: 'Mock email sent successfully',
      };
    },
  };
}

// Default export to match nodemailer's structure
export default {
  createTransport,
};