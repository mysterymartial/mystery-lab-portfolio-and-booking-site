# Mystery Lab Portfolio & Gig Booking Website

A full-stack portfolio and gig booking website for Agbaosi Bolarinwa Minasu (Mystery), CEO of Mystery Lab. Built with Next.js, TypeScript, Express.js, MongoDB Atlas, and Firebase.

## Project Structure

```
myPortfolioWeb/
├── backend/          # Express.js API server
│   ├── src/
│   │   ├── config/  # Database, Firebase, Email configs
│   │   ├── models/  # MongoDB models
│   │   ├── routes/  # API routes
│   │   ├── middleware/ # Auth middleware
│   │   └── server.ts
│   ├── .env.example
│   └── README.md
├── frontend/         # Next.js application
│   ├── app/         # Next.js app directory
│   ├── components/  # React components
│   ├── lib/         # Utilities and API client
│   ├── public/      # Static assets
│   │   ├── logo.png          # Logo (Header: 50x50px, Hero: 200x200px)
│   │   ├── profile-bg.png    # Background image (Hero section)
│   │   └── AGBAOSI BOLARINWA MINASU MYSTERY CV.PDF
│   ├── .env.example
│   └── README.md
├── .gitignore
└── README.md (this file)
```

## Features

### Portfolio Features
- Professional portfolio showcasing CEO profile
- Services showcase (Tech, Music, Martial Arts)
- Featured projects (GigWave, Purity Family Care)
- Client reviews system
- Contact information and social media links

### Booking Features
- Real-time chat interface
- WhatsApp integration
- Comprehensive booking form
- Email notifications

### Admin Panel
- Firebase authentication
- Chat management (view, reply, soft delete, Google Meet links)
- Review approval/rejection
- Booking management
- Site-wide dark mode toggle
- Notification settings

## Technology Stack

### Frontend
- **Next.js 16** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Firebase Auth** - Client-side authentication

### Backend
- **Express.js** - Node.js web framework
- **TypeScript** - Type safety
- **MongoDB Atlas** - Database
- **Firebase Admin SDK** - Server-side auth verification
- **Nodemailer** - Email notifications

## Quick Start

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Firebase project
- SMTP email account

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file from `.env.example`:
```bash
cp .env.example .env
```

4. Configure environment variables in `.env`:
   - MongoDB Atlas connection string
   - Firebase Admin SDK credentials
   - SMTP configuration
   - Admin email

5. Run the backend:
```bash
npm run dev
```

Backend runs on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local` file from `.env.example`:
```bash
cp .env.example .env.local
```

4. Configure environment variables in `.env.local`:
   - Backend API URL
   - Firebase client configuration

5. Run the frontend:
```bash
npm run dev
```

Frontend runs on `http://localhost:3000`

## Environment Variables

See `ENVIRONMENT_SETUP.md` for detailed instructions on obtaining all required keys.

### Backend (.env)
See `backend/.env.example` for complete list:
- `MONGODB_URI` - MongoDB Atlas connection string
- `FIREBASE_PROJECT_ID` - Firebase project ID
- `FIREBASE_PRIVATE_KEY` - Firebase service account private key
- `FIREBASE_CLIENT_EMAIL` - Firebase service account email
- `SMTP_*` - SMTP email configuration
- `ADMIN_EMAIL` - Admin notification email
- `FRONTEND_URL` - Frontend URL for CORS
- `PRODUCTION_URL` - Production backend URL
- `SENTRY_DSN` - Sentry error monitoring (optional)
- `ENABLE_MONITORING` - Enable performance monitoring

### Frontend (.env.local)
See `frontend/.env.example` for complete list:
- `NEXT_PUBLIC_API_URL` - Backend API URL
- `NEXT_PUBLIC_FIREBASE_*` - Firebase client configuration
- `NEXT_PUBLIC_SENTRY_DSN` - Sentry error monitoring (optional)
- `NEXT_PUBLIC_GA_ID` - Google Analytics ID (optional)

## API Endpoints

### Messages
- `GET /api/messages` - Get all messages
- `POST /api/messages` - Create message
- `GET /api/messages/:id` - Get message (admin)
- `DELETE /api/messages/:id` - Soft delete (admin)
- `POST /api/messages/:id/reply` - Reply to message (admin)
- `PUT /api/messages/:id/google-meet` - Set Google Meet link (admin)

### Reviews
- `GET /api/reviews/approved` - Get approved reviews (public)
- `GET /api/reviews` - Get all reviews (admin)
- `POST /api/reviews` - Create review
- `PUT /api/reviews/:id/approve` - Approve review (admin)
- `PUT /api/reviews/:id/reject` - Reject review (admin)

### Bookings
- `GET /api/bookings` - Get all bookings (admin)
- `POST /api/bookings` - Create booking
- `PUT /api/bookings/:id/status` - Update status (admin)

### Settings
- `GET /api/settings/:key` - Get setting
- `PUT /api/settings/:key` - Update setting (admin)

## Authentication

Admin endpoints require Firebase authentication. Include the Firebase ID token in the Authorization header:

```
Authorization: Bearer <firebase-id-token>
```

## Database Schema

### Message
- name, email, message
- deleted (boolean)
- googleMeetLink (optional)
- replies (array)
- timestamps

### Review
- name, rating (1-5), comment
- approved (boolean)
- timestamps

### Booking
- name, email, phone, serviceType
- eventDate, eventLocation, budget, additionalInfo
- status (default: 'pending')
- timestamps

### Setting
- key (unique)
- value (any)
- updatedAt

## Security

- Environment variables are never committed to git
- `.env` files are gitignored
- Firebase Admin SDK for secure server-side auth
- CORS configured for trusted frontend URLs
- MongoDB Atlas with secure connection

## Deployment

See `DEPLOYMENT_GUIDE.md` for detailed deployment instructions.

### Quick Deployment Checklist

**Backend:**
- Set all environment variables (see `backend/.env.example`)
- Deploy to Railway/Render/Heroku/AWS
- Configure MongoDB Atlas network access
- Set up Firebase Admin SDK credentials
- Configure CORS with production URLs

**Frontend:**
- Set all environment variables (see `frontend/.env.example`)
- Deploy to **Vercel** (recommended) or Netlify
- Configure custom domain and SSL
- Update `NEXT_PUBLIC_API_URL` to production backend URL

**Post-Deployment:**
- Test all endpoints
- Verify SSL certificate
- Check monitoring dashboards (Sentry, Analytics)
- Test email notifications
- Verify admin login

## Development

### Running Both Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

## Contact Information

- **Phone**: 08159089791
- **WhatsApp**: 08159089791
- **Secretary**: 0814 679 6931
- **LinkedIn**: [bolarinwa-agbaosi-692231318](https://www.linkedin.com/in/bolarinwa-agbaosi-692231318/)
- **GitHub**: [mysterymartial](https://github.com/mysterymartial)
- **Social Media**: @mysterymartialsax

## Performance & Monitoring

- ✅ **Database Optimization**: Indexes on frequently queried fields
- ✅ **Query Optimization**: Pagination, `.lean()`, selective field projection
- ✅ **Caching Headers**: Public/private cache headers for static and dynamic content
- ✅ **Compression**: Gzip compression enabled
- ✅ **Next.js Image Optimization**: AVIF/WebP support, responsive sizes
- ✅ **Performance Monitoring**: Slow request detection and logging
- ✅ **Analytics**: Google Analytics integration ready

## Testing

Both backend and frontend include comprehensive unit tests with boundary analysis and edge case coverage. Tests are updated to work with new middleware (rate limiting, sanitization).

### Backend Testing

```bash
cd backend
npm test              # Run all tests
npm run test:watch    # Watch mode
npm run test:coverage # With coverage report
```

**Test Coverage**:
- API route handlers (messages, reviews, bookings, settings)
- Database models and schemas
- Authentication middleware
- Error handling
- Boundary values and edge cases

### Frontend Testing

```bash
cd frontend
npm test              # Run all tests
npm run test:watch    # Watch mode
npm run test:coverage # With coverage report
```

**Test Coverage**:
- React components (ChatInterface, BookingForm, etc.)
- API client functions
- User interactions
- Form validation
- Error handling
- Edge cases and boundary conditions

## Chat Features

The application includes a comprehensive chat system with the following features:

### Public Chat
- Real-time message display
- Message submission form
- WhatsApp integration
- Message history viewing

### Admin Chat Management
- View all messages
- Reply to messages (with email notifications)
- Set Google Meet links
- Soft delete messages
- Message filtering and search

### Technical Features
- RESTful API endpoints
- MongoDB storage
- Email notifications
- Firebase authentication for admin
- Real-time updates (polling)

For detailed chat features documentation, see [CHAT_FEATURES.md](./CHAT_FEATURES.md)

## License

Private and proprietary.

---

Built with ❤️ by Mystery Lab
