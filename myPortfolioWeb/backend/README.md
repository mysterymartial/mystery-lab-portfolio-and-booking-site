# Mystery Lab Backend API

Backend API server for Mystery Lab Portfolio and Gig Booking Website, built with Node.js, Express, TypeScript, and MongoDB Atlas.

## Architecture

```
backend/
├── src/
│   ├── config/          # Configuration files
│   │   ├── database.ts  # MongoDB connection
│   │   ├── firebase.ts  # Firebase Admin SDK
│   │   └── email.ts     # Email service configuration
│   ├── models/         # MongoDB models/schemas
│   │   ├── Message.ts
│   │   ├── Review.ts
│   │   ├── Booking.ts
│   │   └── Setting.ts
│   ├── routes/         # API route handlers
│   │   ├── messages.ts
│   │   ├── reviews.ts
│   │   ├── bookings.ts
│   │   └── settings.ts
│   ├── middleware/     # Express middleware
│   │   └── auth.ts     # Firebase authentication middleware
│   └── server.ts       # Main server file
├── dist/               # Compiled JavaScript (generated)
├── .env                # Environment variables (not in git)
├── .env.example        # Environment variables template
├── package.json
└── tsconfig.json
```

## Features

- **RESTful API** for messages, reviews, bookings, and settings
- **MongoDB Atlas** for database storage
- **Firebase Admin SDK** for authentication verification
- **Email notifications** via SMTP
- **TypeScript** for type safety
- **CORS** enabled for frontend communication

## Setup

### Prerequisites

- Node.js 18+
- MongoDB Atlas account
- Firebase project with Admin SDK credentials
- SMTP email account (Gmail recommended)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file from `.env.example`:
```bash
cp .env.example .env
```

3. Configure environment variables in `.env`:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `FIREBASE_PROJECT_ID`: Your Firebase project ID
   - `FIREBASE_PRIVATE_KEY`: Firebase service account private key
   - `FIREBASE_CLIENT_EMAIL`: Firebase service account email
   - `SMTP_*`: SMTP configuration for email notifications
   - `ADMIN_EMAIL`: Email address for receiving notifications
   - `FRONTEND_URL`: Frontend URL for CORS

### Running the Server

**Development mode:**
```bash
npm run dev
```

**Production mode:**
```bash
npm run build
npm start
```

The server will run on `http://localhost:5000` by default.

## API Endpoints

### Messages

- `GET /api/messages` - Get all non-deleted messages
- `POST /api/messages` - Create a new message
- `GET /api/messages/:id` - Get a single message (admin)
- `DELETE /api/messages/:id` - Soft delete a message (admin)
- `POST /api/messages/:id/reply` - Add reply to a message (admin)
- `PUT /api/messages/:id/google-meet` - Set Google Meet link (admin)

### Reviews

- `GET /api/reviews/approved` - Get all approved reviews (public)
- `GET /api/reviews` - Get all reviews (admin)
- `POST /api/reviews` - Create a new review
- `PUT /api/reviews/:id/approve` - Approve a review (admin)
- `PUT /api/reviews/:id/reject` - Reject a review (admin)

### Bookings

- `GET /api/bookings` - Get all bookings (admin)
- `POST /api/bookings` - Create a new booking
- `PUT /api/bookings/:id/status` - Update booking status (admin)

### Settings

- `GET /api/settings/:key` - Get a setting value
- `PUT /api/settings/:key` - Update a setting (admin)

### Health Check

- `GET /health` - Server health check

## Authentication

Admin endpoints require Firebase authentication. Include the Firebase ID token in the Authorization header:

```
Authorization: Bearer <firebase-id-token>
```

## Database Models

### Message
- `name`: string
- `email`: string
- `message`: string
- `deleted`: boolean
- `googleMeetLink`: string (optional)
- `replies`: array of reply objects
- `createdAt`: Date
- `updatedAt`: Date

### Review
- `name`: string
- `rating`: number (1-5)
- `comment`: string
- `approved`: boolean
- `createdAt`: Date
- `updatedAt`: Date

### Booking
- `name`: string
- `email`: string
- `phone`: string
- `serviceType`: string
- `eventDate`: string (optional)
- `eventLocation`: string (optional)
- `budget`: string (optional)
- `additionalInfo`: string (optional)
- `status`: string (default: 'pending')
- `createdAt`: Date
- `updatedAt`: Date

### Setting
- `key`: string (unique)
- `value`: any
- `updatedAt`: Date

## Environment Variables

See `.env.example` for all required environment variables.

## Testing

### Running Tests

**Run all tests:**
```bash
npm test
```

**Run tests in watch mode:**
```bash
npm run test:watch
```

**Run tests with coverage:**
```bash
npm run test:coverage
```

### Test Structure

Tests are located in the `tests/` directory and follow the same structure as `src/`:

```
tests/
├── setup.ts              # Test setup and teardown
├── routes/               # Route handler tests
│   ├── messages.test.ts
│   ├── reviews.test.ts
│   └── bookings.test.ts
└── models/               # Model tests
    └── Message.test.ts
```

### Test Coverage

Tests include comprehensive boundary analysis and edge case testing:

- **Boundary Testing**: Tests minimum/maximum values, empty strings, null/undefined
- **Edge Cases**: Invalid formats, special characters, unicode, very long strings
- **Error Handling**: Database errors, network failures, invalid inputs
- **Authentication**: Admin-only endpoints, token validation
- **Data Validation**: Required fields, data types, constraints

### Example Test Scenarios

**Messages API:**
- Empty message arrays
- Very long messages (10,000+ characters)
- Special characters and unicode
- Soft delete functionality
- Reply functionality
- Google Meet link assignment

**Reviews API:**
- Rating boundaries (1-5)
- Empty comments
- Approval/rejection workflows
- Public vs admin endpoints

**Bookings API:**
- Required vs optional fields
- Various date formats
- Phone number formats
- Status updates

## Security Features

- ✅ **Rate Limiting**: Prevents spam (API: 100/15min, Messages: 10/15min, Reviews: 5/hour, Bookings: 5/hour)
- ✅ **Input Sanitization**: XSS protection using DOMPurify
- ✅ **Security Headers**: Helmet.js with comprehensive security headers
- ✅ **Request Logging**: All requests logged to `logs/` directory
- ✅ **Error Monitoring**: Sentry integration for production
- ✅ **Environment Variables**: Never commit `.env` file to version control
- ✅ **Strong Credentials**: Use strong MongoDB Atlas and Firebase credentials
- ✅ **CORS**: Only trusted frontend URLs allowed

## License

Private and proprietary.
