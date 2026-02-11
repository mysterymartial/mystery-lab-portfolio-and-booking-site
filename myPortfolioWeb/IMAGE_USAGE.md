# Image Usage Guide

## Image Files in `frontend/public/`

### logo.png
**Purpose:** Company/Personal logo  
**Usage:**
- **Header Component** (`components/Header.tsx`): 
  - Size: `50x50` pixels
  - Location: Navigation bar, left side
  - Displays alongside "Mystery Lab" text
  
- **Hero Component** (`components/Hero.tsx`):
  - Size: `200x200` pixels  
  - Location: Center of hero section, above name
  - Prominent display with rounded corners and shadow

### profile-bg.png
**Purpose:** Background image for hero section  
**Usage:**
- **Hero Component** (`components/Hero.tsx`):
  - Used as CSS `backgroundImage`
  - Covers full hero section (`bg-cover bg-center bg-fixed`)
  - Has dark overlay (`bg-primary-dark/80`) for text readability
  - Full-screen background with parallax effect

## Image Sizes Summary

| Image | Component | Size | Purpose |
|-------|-----------|------|---------|
| `logo.png` | Header | 50x50px | Navigation logo |
| `logo.png` | Hero | 200x200px | Prominent logo display |
| `profile-bg.png` | Hero | Full screen | Background image |

## Notes

- All images are optimized by Next.js Image component
- Logo uses Next.js `<Image>` component for optimization
- Background uses CSS `backgroundImage` for full coverage
- Images are stored in `frontend/public/` directory
- Next.js automatically serves files from `/public` at root URL (`/logo.png`, `/profile-bg.png`)
