import mongoose from 'mongoose';
import Message from '../../src/models/Message';

describe('Message Model - Boundary Analysis & Edge Cases', () => {
  describe('Schema Validation', () => {
    it('should create message with required fields', async () => {
      const message = new Message({
        name: 'Test User',
        email: 'test@example.com',
        message: 'Test message',
      });

      const saved = await message.save();
      expect(saved._id).toBeDefined();
      expect(saved.name).toBe('Test User');
      expect(saved.deleted).toBe(false);
    });

    it('should set default deleted to false', async () => {
      const message = new Message({
        name: 'Test User',
        email: 'test@example.com',
        message: 'Test message',
      });

      const saved = await message.save();
      expect(saved.deleted).toBe(false);
    });

    it('should require name field', async () => {
      const message = new Message({
        email: 'test@example.com',
        message: 'Test message',
      });

      await expect(message.save()).rejects.toThrow();
    });

    it('should require email field', async () => {
      const message = new Message({
        name: 'Test User',
        message: 'Test message',
      });

      await expect(message.save()).rejects.toThrow();
    });

    it('should require message field', async () => {
      const message = new Message({
        name: 'Test User',
        email: 'test@example.com',
      });

      await expect(message.save()).rejects.toThrow();
    });

    // Boundary: Empty arrays
    it('should initialize replies as empty array', async () => {
      const message = new Message({
        name: 'Test User',
        email: 'test@example.com',
        message: 'Test message',
      });

      const saved = await message.save();
      expect(saved.replies).toEqual([]);
    });

    // Edge: Replies array
    it('should save multiple replies', async () => {
      const message = new Message({
        name: 'Test User',
        email: 'test@example.com',
        message: 'Test message',
        replies: [
          { message: 'Reply 1', timestamp: new Date() },
          { message: 'Reply 2', timestamp: new Date() },
        ],
      });

      const saved = await message.save();
      expect(saved.replies).toHaveLength(2);
    });

    // Edge: Optional googleMeetLink
    it('should save message without googleMeetLink', async () => {
      const message = new Message({
        name: 'Test User',
        email: 'test@example.com',
        message: 'Test message',
      });

      const saved = await message.save();
      expect(saved.googleMeetLink).toBeUndefined();
    });

    it('should save message with googleMeetLink', async () => {
      const meetLink = 'https://meet.google.com/test';
      const message = new Message({
        name: 'Test User',
        email: 'test@example.com',
        message: 'Test message',
        googleMeetLink: meetLink,
      });

      const saved = await message.save();
      expect(saved.googleMeetLink).toBe(meetLink);
    });

    // Edge: Timestamps
    it('should auto-generate createdAt and updatedAt', async () => {
      const message = new Message({
        name: 'Test User',
        email: 'test@example.com',
        message: 'Test message',
      });

      const saved = await message.save();
      expect(saved.createdAt).toBeInstanceOf(Date);
      expect(saved.updatedAt).toBeInstanceOf(Date);
    });

    it('should update updatedAt on save', async () => {
      const message = new Message({
        name: 'Test User',
        email: 'test@example.com',
        message: 'Test message',
      });

      const saved = await message.save();
      const originalUpdatedAt = saved.updatedAt;

      await new Promise(resolve => setTimeout(resolve, 1000));
      saved.message = 'Updated message';
      const updated = await saved.save();

      expect(updated.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
    });
  });

  describe('Soft Delete', () => {
    it('should soft delete message', async () => {
      const message = new Message({
        name: 'Test User',
        email: 'test@example.com',
        message: 'Test message',
      });

      const saved = await message.save();
      saved.deleted = true;
      const deleted = await saved.save();

      expect(deleted.deleted).toBe(true);
    });

    it('should query non-deleted messages', async () => {
      await Message.create({
        name: 'Active User',
        email: 'active@example.com',
        message: 'Active message',
        deleted: false,
      });

      await Message.create({
        name: 'Deleted User',
        email: 'deleted@example.com',
        message: 'Deleted message',
        deleted: true,
      });

      const activeMessages = await Message.find({ deleted: false }).exec();
      expect(activeMessages.length).toBeGreaterThan(0);
      expect(activeMessages.every((m: any) => m.deleted === false)).toBe(true);
    });
  });
});
