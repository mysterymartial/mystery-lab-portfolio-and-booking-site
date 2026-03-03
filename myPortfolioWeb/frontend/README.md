# Mystery Lab Frontend

Next.js frontend application for Mystery Lab Portfolio and Gig Booking Website.

## Architecture

```
frontend/
├── app/                    # Next.js app directory
│   ├── admin/             # Admin pages
│   ├── booking/           # Booking pages
│   ├── api/               # API routes (if needed)
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Homepage
├── components/            # React components
│   ├── About.tsx
│   ├── Admin*.tsx        # Admin components
│   ├── BookingForm.tsx
│   ├── ChatInterface.tsx
│   ├── Contact.tsx
│   ├── Footer.tsx
│   ├── Header.tsx
│   ├── Hero.tsx
│   ├── Projects.tsx
│   ├── Reviews.tsx
│   ├── Services.tsx
│   └── ThemeProvider.tsx
├── lib/                   # Utilities and configurations
│   ├── api.ts            # Backend API client
│   └── firebase.ts       # Firebase client configuration
├── public/                # Static assets
│   ├── logo.png          # Logo image (used in Header: 50x50px, Hero: 200x200px)
│   ├── profile-bg.png    # Background image (used as Hero section background)
│   └── AGBAOSI BOLARINWA MINASU MYSTERY CV.pdf  # CV/Resume PDF
├── .env.example          # Environment variables template
├── package.json
├── next.config.js
├── tailwind.config.ts
└── tsconfig.json
```

## Features

- **Next.js 16** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Firebase Authentication** (client-side)
- **Backend API Integration** via REST API
- **Responsive Design**
- **Dark Mode Support** (site-wide, controlled by admin)

## Setup

### Prerequisites

- Node.js 18+
- Backend API running (see backend README)
- Firebase project configured

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env.local` file from `.env.example`:
```bash
cp .env.example .env.local
```

3. Configure environment variables in `.env.local`:
   - `NEXT_PUBLIC_API_URL`: Backend API URL (default: http://localhost:5000/api)
   - `NEXT_PUBLIC_FIREBASE_*`: Firebase client configuration

### Running the Application

**Development mode:**
```bash
npm run dev
```

**Production build:**
```bash
npm run build
npm start
```

The application will run on `http://localhost:3000` by default.

## Key Components

### API Client (`lib/api.ts`)
Centralized API client for communicating with the backend. All API calls go through this module.

### Firebase Auth (`lib/firebase.ts`)
Firebase authentication setup with React context for managing user state.

### Theme Provider (`components/ThemeProvider.tsx`)
Manages dark mode theme, syncing with backend settings.

## Pages

- `/` - Portfolio homepage
- `/booking` - Gig booking page with chat and form
- `/admin` - Admin dashboard (requires authentication)

## Environment Variables

See `.env.example` for all required environment variables. See `ENVIRONMENT_SETUP.md` in root for detailed instructions on obtaining Firebase and MongoDB keys.

## Building for Production

```bash
npm run build
```

The production build will be in the `.next` directory.

## Deployment

The frontend can be deployed to:
- **Vercel** (recommended for Next.js)
- **Netlify**
- **Any Node.js hosting**

Make sure to set environment variables in your hosting platform.

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

Tests are located in the `tests/` directory:

```
tests/
├── setup.ts                    # Test configuration and mocks
├── components/                 # Component tests
│   ├── ChatInterface.test.tsx
│   └── BookingForm.test.tsx
└── lib/                        # Utility tests
    └── api.test.ts
```

### Test Coverage

Tests include comprehensive boundary analysis and edge case testing:

- **Component Rendering**: All UI elements render correctly
- **User Interactions**: Form submissions, button clicks, input changes
- **Boundary Testing**: Empty inputs, maximum lengths, invalid formats
- **Edge Cases**: Special characters, unicode, very long strings
- **Error Handling**: API errors, network failures, validation errors
- **State Management**: Loading states, success states, error states
- **API Integration**: Mock API calls, request/response handling

### Example Test Scenarios

**ChatInterface Component:**
- Empty message list
- Message display and filtering
- Form validation (empty fields)
- Very long messages
- Special characters
- WhatsApp integration
- Error handling

**BookingForm Component:**
- Required field validation
- Optional field handling
- Service type selection
- Success state display
- Form reset after submission
- Error handling

**API Client:**
- Successful API calls
- Error responses
- Network failures
- Empty responses
- Authentication headers

## License

Private and proprietary.
