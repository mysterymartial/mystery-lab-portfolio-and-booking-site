/**
 * Unit tests for email configuration (createTransporter, sendEmail).
 * Tests SMTP transport creation and email sending with mocked nodemailer.
 */

const mockSendMail = jest.fn();
const mockCreateTransport = jest.fn(() => ({
  sendMail: mockSendMail,
}));

jest.mock('nodemailer', () => ({
  createTransport: mockCreateTransport,
}));

import { createTransporter, sendEmail } from '../../src/config/email';

const originalEnv = process.env;

describe('Email Config - createTransporter', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('should create transporter with SMTP_HOST from env', () => {
    process.env.SMTP_HOST = 'smtp.gmail.com';
    process.env.SMTP_PORT = '587';
    process.env.SMTP_USER = 'test@example.com';
    process.env.SMTP_PASS = 'secret';

    createTransporter();

    expect(mockCreateTransport).toHaveBeenCalledWith(
      expect.objectContaining({
        host: 'smtp.gmail.com',
        port: 587,
        auth: { user: 'test@example.com', pass: 'secret' },
      })
    );
  });

  it('should use SMTP_SECURE=true when env is "true"', () => {
    process.env.SMTP_HOST = 'smtp.gmail.com';
    process.env.SMTP_PORT = '587';
    process.env.SMTP_SECURE = 'true';

    createTransporter();

    expect(mockCreateTransport).toHaveBeenCalledWith(
      expect.objectContaining({ secure: true })
    );
  });

  it('should use SMTP_SECURE=false when env is not "true"', () => {
    process.env.SMTP_HOST = 'smtp.gmail.com';
    process.env.SMTP_PORT = '587';
    process.env.SMTP_SECURE = 'false';

    createTransporter();

    expect(mockCreateTransport).toHaveBeenCalledWith(
      expect.objectContaining({ secure: false })
    );
  });

  it('should default port to 587 when SMTP_PORT is missing', () => {
    process.env.SMTP_HOST = 'smtp.gmail.com';
    delete process.env.SMTP_PORT;

    createTransporter();

    expect(mockCreateTransport).toHaveBeenCalledWith(
      expect.objectContaining({ port: 587 })
    );
  });
});

describe('Email Config - sendEmail', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSendMail.mockResolvedValue({ messageId: 'test-id' });
    process.env = { ...originalEnv, SMTP_FROM: 'noreply@example.com' };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('should call sendMail with to, subject, text, and from', async () => {
    const result = await sendEmail(
      'admin@example.com',
      'Test Subject',
      'Test body'
    );

    expect(mockSendMail).toHaveBeenCalledWith({
      from: 'noreply@example.com',
      to: 'admin@example.com',
      subject: 'Test Subject',
      text: 'Test body',
      html: undefined,
    });
    expect(result).toBe(true);
  });

  it('should include html when provided', async () => {
    await sendEmail(
      'admin@example.com',
      'Subject',
      'Plain text',
      '<p>HTML body</p>'
    );

    expect(mockSendMail).toHaveBeenCalledWith(
      expect.objectContaining({ html: '<p>HTML body</p>' })
    );
  });

  it('should return true on successful send', async () => {
    mockSendMail.mockResolvedValue({ messageId: 'ok' });

    const result = await sendEmail('a@b.com', 'S', 'T');

    expect(result).toBe(true);
  });

  it('should return false and not throw when sendMail fails', async () => {
    mockSendMail.mockRejectedValue(new Error('SMTP error'));
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    const result = await sendEmail('a@b.com', 'S', 'T');

    expect(result).toBe(false);
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});
