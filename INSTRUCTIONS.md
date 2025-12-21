# Meridian Coastal Group - Azure Bay District Landing Page
## Complete Setup & Configuration Guide

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Prerequisites](#prerequisites)
3. [Local Setup](#local-setup)
4. [Environment Configuration](#environment-configuration)
5. [Running the Project](#running-the-project)
6. [Content Management](#content-management)
7. [Deployment](#deployment)
8. [API Integration](#api-integration)
9. [Troubleshooting](#troubleshooting)

---

## Project Overview

**Azure Bay District** is a premium real estate landing page built for **Meridian Coastal Group**, a fictional developer specializing in luxury residential projects in emerging coastal districts.

### What This Project Includes

✨ **Frontend**
- Responsive Next.js 16 application
- Bilingual content (Spanish/English)
- Interactive hero section with animations
- Investment opportunity sections
- Property specifications showcase
- FAQ and contact forms

🤖 **Lead Automation**
- Contact form with validation
- ALTCHA security verification
- HubSpot CRM integration
- PDF dossier generation
- Email notifications via Resend
- AWS S3 file storage

📱 **Mobile Optimized**
- Mobile-first design approach
- Touch-friendly navigation
- Optimized images and lazy loading
- Responsive typography

---

## Prerequisites

Before starting, ensure you have:

- **Node.js**: v18.0.0 or higher
- **npm** or **yarn**: Latest version
- **Git**: For cloning the repository
- **Code Editor**: VS Code recommended

### Check Your Node.js Version

```bash
node --version
npm --version
```

Should output something like:
```
v18.17.0
9.8.0
```

---

## Local Setup

### Step 1: Clone the Repository

```bash
git clone https://github.com/ToniIAPro73/v0-landing-page-real-state.git
cd v0-landing-page-real-state
```

### Step 2: Install Dependencies

```bash
npm install
# or
yarn install
```

This will install all required packages listed in `package.json`.

### Step 3: Create Environment File

```bash
cp .env.example .env.local
```

This creates a local `.env.local` file with default values.

---

## Environment Configuration

### Basic Setup

**`.env.local`**

```env
# ==================== REQUIRED ====================

# Site URL (used for links and redirects)
NEXT_PUBLIC_SITE_URL=https://meridian-coastal-group.vercel.app

# ==================== SECURITY (OPTIONAL) ====================

# reCAPTCHA Enterprise (for form protection)
RECAPTCHA_ENTERPRISE_PROJECT_ID=your_project_id
RECAPTCHA_ENTERPRISE_KEY_ID=your_key_id
RECAPTCHA_ENTERPRISE_KEY=your_api_key

# ALTCHA (already integrated, configure if self-hosting)
ALTCHA_CHALLENGE_ENDPOINT=/api/altcha/challenge

# ==================== CRM & EMAIL ====================

# HubSpot Integration (for lead management)
HUBSPOT_PORTAL_ID=your_portal_id
HUBSPOT_ACCESS_TOKEN=your_access_token

# Resend (for email delivery)
RESEND_API_KEY=your_resend_api_key
RESEND_FROM_EMAIL=noreply@meridian-coastal-group.com

# ==================== FILE STORAGE ====================

# AWS S3 (for PDF dossier storage)
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=eu-west-1
AWS_S3_BUCKET=meridian-coastal-group-pdfs

# ==================== DEVELOPMENT ====================

# Next.js environment
NODE_ENV=development
```

### Obtaining API Keys

#### HubSpot Setup
1. Go to [HubSpot](https://app.hubspot.com/)
2. Settings → Integrations → Private Apps
3. Create a new private app
4. Copy Portal ID and Access Token
5. Add to `.env.local`

#### Resend Setup
1. Go to [Resend](https://resend.com/)
2. Dashboard → API Keys
3. Create new API key
4. Add to `.env.local`

#### AWS S3 Setup
1. Go to [AWS Console](https://console.aws.amazon.com/)
2. Create IAM user with S3 permissions
3. Create S3 bucket for PDFs
4. Add credentials to `.env.local`

#### ALTCHA Setup
ALTCHA is pre-configured. No additional setup needed unless self-hosting.

---

## Running the Project

### Development Mode

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

**Features in dev mode:**
- Hot module reloading (instant updates on save)
- Development error overlay
- Detailed console logs
- Source maps for debugging

### Production Build

```bash
npm run build
npm start
```

Creates an optimized production build and starts the server.

### Linting

```bash
npm run lint
```

Checks for code quality issues.

### Testing

```bash
npm run test
```

Runs the test suite using Vitest.

---

## Content Management

All text content is centralized in `app/page.tsx` for easy management.

### Structure

```typescript
const content = {
  es: {
    hero: { /* Spanish hero content */ },
    menu: { /* Navigation labels */ },
    wynnEffect: { /* Investment narrative */ },
    features: { /* Property specs */ },
    apartments: { /* Unit types */ },
    // ... more sections
  },
  en: {
    // English translations of all sections
  }
};
```

### Updating Content

1. Open `app/page.tsx`
2. Find the relevant section in `content.es` or `content.en`
3. Update the text
4. Save the file
5. Changes appear instantly in development mode

### Adding New Sections

1. Add new section to both `content.es` and `content.en`
2. Create corresponding JSX in the component
3. Add scroll animation using the `visibleSections` state
4. Add navigation link if needed

### Example: Adding a New Hero CTA

```typescript
// 1. Update content
const content = {
  es: {
    hero: {
      cta1: "Descargar Dossier",
      cta2: "Agendar Cita",  // New CTA
    }
  },
  en: {
    hero: {
      cta1: "Download Dossier",
      cta2: "Schedule Call",  // New CTA
    }
  }
};

// 2. Add JSX button
<Button onClick={() => scrollToSection("contact")}>
  {t.hero.cta2}
</Button>
```

---

## Deployment

### Deploy to Vercel (Recommended)

**Option 1: Via GitHub**

1. Push code to GitHub repository
2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Click "New Project"
4. Select your GitHub repository
5. Configure environment variables
6. Click "Deploy"

**Option 2: CLI**

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Deploy to production
vercel --prod
```

### Environment Variables in Vercel

1. Go to Project Settings → Environment Variables
2. Add all variables from `.env.example`
3. Set `NEXT_PUBLIC_SITE_URL` to your Vercel domain
4. Redeploy for changes to take effect

### Custom Domain Setup

1. In Vercel dashboard: Settings → Domains
2. Enter your custom domain
3. Update DNS records as shown
4. Wait for propagation (5-30 minutes)

---

## API Integration

### Lead Submission (`/api/submit-lead`)

**Purpose**: Receives form submissions and orchestrates automation

**Flow**:
1. Form validation (client-side)
2. ALTCHA verification
3. Lead creation in HubSpot
4. PDF dossier generation
5. Email notification via Resend
6. File upload to AWS S3
7. Response with PDF download link

**Request**:
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "language": "es",
  "utm": {},
  "altchaPayload": "..."
}
```

### PDF Generation (`/api/generate-pdf`)

**Purpose**: Creates personalized investment dossier PDFs

**Includes**:
- Investment scenarios (2026-2032)
- Property specifications
- Payment plan details
- Marina effect projections
- Floor plans and renderings

### ALTCHA Verification (`/api/altcha/challenge`)

**Purpose**: Provides bot protection without third-party dependencies

**Features**:
- Client-side verification
- No tracking
- Silent operation
- Mobile-friendly

---

## Troubleshooting

### Build Errors

**Error**: `Module not found`
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Error**: `Port 3000 already in use`
```bash
# Use different port
npm run dev -- -p 3001
```

### Environment Variable Issues

**Problem**: Environment variables not loading
```bash
# Check .env.local file exists
ls -la .env.local

# Restart development server
# Kill process and run npm run dev again
```

### HubSpot Integration Issues

**Problem**: Leads not appearing in HubSpot
1. Verify `HUBSPOT_PORTAL_ID` is correct
2. Check API token hasn't expired
3. Ensure form data matches HubSpot field definitions
4. Check browser console for error messages

### PDF Generation Issues

**Problem**: PDF download fails
1. Verify AWS credentials in `.env.local`
2. Check S3 bucket permissions
3. Ensure bucket name is correct
4. Check disk space on server

### Email Delivery Issues

**Problem**: Emails not received
1. Verify `RESEND_API_KEY` is valid
2. Check sender email address
3. Look in spam/junk folder
4. Verify email address format is valid

---

## Performance Tips

### Optimize Images

```bash
# Use Next.js Image component
<Image 
  src="/assets/image.jpg"
  alt="Description"
  width={1200}
  height={800}
  priority={true}  // For above-fold images
/>
```

### Code Splitting

```bash
# Lazy load components
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <div>Loading...</div>
});
```

### Caching Strategy

See `next.config.js` for detailed caching rules:
- Static assets: 1 year cache
- HTML: 1 hour cache
- API routes: No cache

---

## Support & Contact

**Project Lead**: Toni  
**Company**: Anclora Cognitive Solutions  
**Repository**: [GitHub](https://github.com/ToniIAPro73/v0-landing-page-real-state)  
**Live Demo**: [Meridian Coastal Group](https://meridian-coastal-group.vercel.app)

---

## License

MIT License - Feel free to use this as a template for your own projects.

---

**Last Updated**: December 21, 2025
**Version**: 1.0.0
