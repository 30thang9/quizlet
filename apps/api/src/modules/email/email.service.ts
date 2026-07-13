import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export interface SendPasswordResetEmailData {
  email: string;
  name: string;
  resetUrl: string;
}

export interface SendWelcomeEmailData {
  email: string;
  name: string;
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly fromEmail: string;
  private readonly appName: string;

  constructor(private readonly configService: ConfigService) {
    this.fromEmail = this.configService.get('EMAIL_FROM', 'noreply@quizlet.com');
    this.appName = this.configService.get('APP_NAME', 'Quizlet');
  }

  async sendPasswordResetEmail(data: SendPasswordResetEmailData): Promise<boolean> {
    const { email, name, resetUrl } = data;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #3B82F6; color: white; padding: 24px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #fff; padding: 32px; border: 1px solid #e5e7eb; border-top: none; }
            .button { display: inline-block; background: #3B82F6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 500; margin: 16px 0; }
            .footer { text-align: center; padding: 16px; color: #6b7280; font-size: 12px; }
            .warning { background: #fef3c7; padding: 12px; border-radius: 6px; margin: 16px 0; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>${this.appName}</h1>
            </div>
            <div class="content">
              <h2>Hi ${name || 'there'},</h2>
              <p>You requested a password reset for your ${this.appName} account.</p>
              <p>Click the button below to reset your password:</p>
              <div style="text-align: center;">
                <a href="${resetUrl}" class="button">Reset Password</a>
              </div>
              <div class="warning">
                <strong>⚠️ This link will expire in 1 hour.</strong><br>
                If you didn't request this password reset, please ignore this email.
              </div>
              <p>Alternatively, you can copy and paste this URL into your browser:</p>
              <p style="word-break: break-all; font-size: 12px; color: #666;">${resetUrl}</p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} ${this.appName}. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const text = `
      Hi ${name || 'there'},

      You requested a password reset for your ${this.appName} account.

      Click the link below to reset your password:
      ${resetUrl}

      This link will expire in 1 hour.

      If you didn't request this password reset, please ignore this email.

      © ${new Date().getFullYear()} ${this.appName}. All rights reserved.
    `;

    return this.send({ to: email, subject: `Reset your ${this.appName} password`, html, text });
  }

  async sendWelcomeEmail(data: SendWelcomeEmailData): Promise<boolean> {
    const { email, name } = data;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #3B82F6; color: white; padding: 24px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #fff; padding: 32px; border: 1px solid #e5e7eb; border-top: none; }
            .button { display: inline-block; background: #3B82F6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 500; margin: 16px 0; }
            .footer { text-align: center; padding: 16px; color: #6b7280; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>${this.appName}</h1>
            </div>
            <div class="content">
              <h2>Welcome${name ? `, ${name}` : ''}!</h2>
              <p>Thank you for joining ${this.appName}. We're excited to have you as part of our learning community!</p>
              <p>With ${this.appName}, you can:</p>
              <ul>
                <li>Create and study flashcards</li>
                <li>Learn with spaced repetition</li>
                <li>Test yourself with quizzes</li>
                <li>Collaborate with classmates</li>
              </ul>
              <div style="text-align: center;">
                <a href="#" class="button">Get Started</a>
              </div>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} ${this.appName}. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    return this.send({ to: email, subject: `Welcome to ${this.appName}!`, html });
  }

  async send(options: EmailOptions): Promise<boolean> {
    const { to, subject, html, text } = options;

    const emailProvider = this.configService.get('EMAIL_PROVIDER', 'mock');

    try {
      switch (emailProvider) {
        case 'resend':
          return await this.sendWithResend(to, subject, html, text);
        case 'sendgrid':
          return await this.sendWithSendGrid(to, subject, html, text);
        default:
          return this.logEmail(to, subject, html);
      }
    } catch (error) {
      this.logger.error(`Failed to send email to ${to}: ${error.message}`);
      return false;
    }
  }

  private async sendWithResend(to: string, subject: string, html: string, text?: string): Promise<boolean> {
    const apiKey = this.configService.get('RESEND_API_KEY');
    if (!apiKey) {
      this.logger.warn('RESEND_API_KEY not configured, falling back to mock');
      return this.logEmail(to, subject, html);
    }

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: this.fromEmail,
        to,
        subject,
        html,
        text,
      }),
    });

    if (!response.ok) {
      throw new Error(`Resend API error: ${response.statusText}`);
    }

    return true;
  }

  private async sendWithSendGrid(to: string, subject: string, html: string, text?: string): Promise<boolean> {
    const apiKey = this.configService.get('SENDGRID_API_KEY');
    if (!apiKey) {
      this.logger.warn('SENDGRID_API_KEY not configured, falling back to mock');
      return this.logEmail(to, subject, html);
    }

    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: to }] }],
        from: { email: this.fromEmail },
        subject,
        content: [
          { type: 'text/plain', value: text || html },
          { type: 'text/html', value: html },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`SendGrid API error: ${response.statusText}`);
    }

    return true;
  }

  private logEmail(to: string, subject: string, html: string): boolean {
    this.logger.log(`
      ====================================
      📧 EMAIL SENT (Mock Mode)
      ====================================
      To: ${to}
      Subject: ${subject}
      ====================================
      HTML Content:
      ${html.substring(0, 500)}...
      ====================================
    `);
    return true;
  }
}
