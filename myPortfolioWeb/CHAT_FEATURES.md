# Chat Features Documentation

## Overview

The Mystery Lab Portfolio and Gig Booking Website includes a comprehensive real-time chat system that allows clients to communicate with Agbaosi Bolarinwa Minasu (Mystery) for booking gigs, asking questions, and discussing projects. The chat system integrates seamlessly with WhatsApp and provides admin tools for managing conversations.

## Core Chat Features

### 1. **Public Chat Interface**

**Location**: `/booking` page

**Features**:
- **Real-time Message Display**: Messages are fetched and displayed in real-time (polling every 5 seconds)
- **Message Input Form**: Users can submit messages with:
  - Name (required)
  - Email (required)
  - Message text (required)
- **WhatsApp Integration**: Direct link to WhatsApp for instant communication
- **Message History**: View all non-deleted messages in chronological order
- **Auto-scroll**: Automatically scrolls to latest message

**User Flow**:
1. User visits booking page
2. Sees existing messages (if any)
3. Fills out name, email, and message
4. Submits message
5. Message appears in chat
6. Admin receives email notification (if enabled)

### 2. **Admin Chat Management**

**Location**: `/admin` → Chats tab

**Features**:

#### View All Messages
- List of all messages (non-deleted)
- Shows sender name, email, message preview
- Click to view full message details
- Timestamp display

#### Reply to Messages
- Admin can reply directly to messages
- Replies are stored in message's replies array
- Email notification sent to original sender
- Reply history visible in message details

#### Google Meet Integration
- Admin can set Google Meet links for messages
- Links stored with message
- Displayed in message details
- Clickable link opens Google Meet

#### Soft Delete
- Messages can be soft-deleted (not permanently removed)
- Deleted messages don't appear in public chat
- Admin can still view deleted messages (if needed)
- `deleted` flag set to `true`

### 3. **Message Data Structure**

```typescript
{
  _id: string;
  name: string;
  email: string;
  message: string;
  deleted: boolean;           // Soft delete flag
  googleMeetLink?: string;   // Optional Google Meet link
  replies: Array<{           // Admin replies
    message: string;
    timestamp: Date;
  }>;
  createdAt: Date;
  updatedAt: Date;
}
```

### 4. **Email Notifications**

**When Enabled**:
- New message received → Admin receives email
- Reply sent → Original sender receives email
- New booking request → Admin receives email

**Configuration**:
- Can be enabled/disabled in admin settings
- Configured via SMTP settings in backend `.env`
- Email includes sender details and message content

### 5. **WhatsApp Integration**

**Direct Communication**:
- WhatsApp button in chat interface
- Opens WhatsApp with pre-filled number: `08159089791`
- Format: `https://wa.me/2348159089791`
- Opens in new tab/window

**Use Cases**:
- Quick communication
- Urgent inquiries
- Mobile-friendly messaging
- International communication

## Technical Implementation

### Backend API Endpoints

#### `GET /api/messages`
- Returns all non-deleted messages
- Sorted by `createdAt` descending
- Public endpoint (no auth required)

#### `POST /api/messages`
- Creates new message
- Validates required fields (name, email, message)
- Sends email notification to admin
- Returns created message

#### `GET /api/messages/:id` (Admin)
- Gets single message by ID
- Includes replies and Google Meet link
- Requires Firebase authentication

#### `DELETE /api/messages/:id` (Admin)
- Soft deletes message
- Sets `deleted: true`
- Message no longer appears in public list

#### `POST /api/messages/:id/reply` (Admin)
- Adds reply to message
- Stores reply in `replies` array
- Sends email to original sender
- Returns updated message

#### `PUT /api/messages/:id/google-meet` (Admin)
- Sets Google Meet link for message
- Updates `googleMeetLink` field
- Returns updated message

### Frontend Components

#### `ChatInterface`
- Main chat component
- Handles message display and submission
- Polls for new messages every 5 seconds
- Form validation
- Error handling

#### `AdminChat`
- Admin message management interface
- Message list with selection
- Reply functionality
- Google Meet link management
- Soft delete functionality

### Database Schema

**Messages Collection**:
- Indexed on `deleted` field for efficient queries
- Timestamps auto-managed by Mongoose
- Replies stored as embedded documents

## User Scenarios

### Scenario 1: Client Sends Initial Message

1. Client visits `/booking`
2. Sees chat interface
3. Fills out form:
   - Name: "John Doe"
   - Email: "john@example.com"
   - Message: "I'm interested in booking a saxophone performance"
4. Clicks "Send Message"
5. Message appears in chat
6. Admin receives email notification
7. Admin can view message in admin panel

### Scenario 2: Admin Replies to Message

1. Admin logs into `/admin`
2. Navigates to "Chats" tab
3. Sees list of messages
4. Clicks on a message
5. Sees message details
6. Types reply: "Thanks for your interest! When is your event?"
7. Clicks "Send Reply"
8. Reply saved to message
9. Original sender receives email with reply

### Scenario 3: Admin Sets Google Meet Link

1. Admin views message details
2. Enters Google Meet link: `https://meet.google.com/abc-defg-hij`
3. Clicks "Set"
4. Link saved with message
5. Link displayed in message details
6. Clickable link opens Google Meet

### Scenario 4: Admin Soft Deletes Message

1. Admin views message list
2. Clicks "Delete" on unwanted message
3. Confirms deletion
4. Message marked as deleted
5. Message no longer appears in public chat
6. Message still exists in database (soft delete)

### Scenario 5: Client Uses WhatsApp

1. Client visits `/booking`
2. Sees WhatsApp button
3. Clicks button
4. WhatsApp opens with pre-filled number
5. Client can send message directly via WhatsApp
6. Admin receives WhatsApp message

## Boundary Cases & Edge Cases Handled

### Input Validation
- ✅ Empty name, email, or message rejected
- ✅ Very long messages (10,000+ characters) handled
- ✅ Special characters and unicode supported
- ✅ Email format validation
- ✅ Whitespace-only inputs handled

### Data Handling
- ✅ Deleted messages filtered from public view
- ✅ Multiple replies to same message supported
- ✅ Very long Google Meet links handled
- ✅ Empty Google Meet links allowed
- ✅ Timestamp handling and sorting

### Error Handling
- ✅ API errors displayed to user
- ✅ Network failures handled gracefully
- ✅ Invalid message IDs return 404
- ✅ Database connection errors handled
- ✅ Email sending failures don't block message creation

### Performance
- ✅ Message polling optimized (5-second intervals)
- ✅ Efficient database queries (indexed fields)
- ✅ Pagination support (if needed)
- ✅ Auto-scroll prevents UI lag

## Security Features

- **Authentication**: Admin endpoints require Firebase authentication
- **Input Sanitization**: All inputs validated before storage
- **Soft Delete**: Messages not permanently deleted (data retention)
- **CORS**: Configured for trusted frontend URLs only
- **Email Security**: SMTP credentials stored securely in environment variables

## Future Enhancements

Potential improvements:
- WebSocket support for real-time updates (instead of polling)
- Message read receipts
- File attachments
- Message search functionality
- Chat history export
- Typing indicators
- Message reactions/emojis
- Chat rooms for different topics
- Automated responses/bot integration

## Testing

Comprehensive test coverage includes:
- ✅ Message creation with valid/invalid data
- ✅ Message retrieval and filtering
- ✅ Reply functionality
- ✅ Google Meet link assignment
- ✅ Soft delete operations
- ✅ Error handling scenarios
- ✅ Boundary value testing
- ✅ Edge case handling

See test files:
- `backend/tests/routes/messages.test.ts`
- `frontend/tests/components/ChatInterface.test.tsx`

## Contact Information

For chat-related inquiries:
- **Phone**: 08159089791
- **WhatsApp**: 08159089791
- **Email**: Configured in admin settings

---

**Last Updated**: February 2026
**Version**: 1.0.0
