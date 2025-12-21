# Azure Bay District - Meridian Coastal Group Landing Page

**Premium Real Estate Portfolio Case Study**

*This repository is automatically synced with [v0.app](https://v0.app) deployments*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://azurebay-meridian.vercel.app)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.app-black?style=for-the-badge)](https://v0.app)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

## 📋 Overview

Azure Bay is a fictional residential real estate development created by **Meridian Coastal Group** as a portfolio case study to demonstrate premium landing page design, bilingual content management, lead automation, and investment narrative structure.

**Project Location**: https://azurebay-meridian.vercel.app

### Key Features

✨ **Premium UI/UX Design**
- Responsive layout (mobile-first design)
- Luxury aesthetic with custom design system
- Smooth animations and transitions
- Dark/Light mode support

📱 **Bilingual Support**
- Spanish (ES) and English (EN) content
- Language toggle in navigation
- SEO-optimized meta tags

💼 **Lead Management & Automation**
- Integrated dossier download system
- ALTCHA security verification
- HubSpot CRM integration
- Email automation with Resend
- PDF generation with PDF-Lib
- AWS S3 file storage

🏗️ **Real Estate Specific**
- Property specifications (Studios, 1BR, 2BR, 3BR)
- Payment plan configurations
- Investment opportunity projections
- Location and amenities showcase
- Investment FAQ section
- Trust & credibility indicators

## 🎯 Project Details

### Developer
**Meridian Coastal Group** (Fictional)
- Specializing in luxury residential projects in emerging coastal districts
- Portfolio case study by Anclora Cognitive Solutions

### Development Timeline
- **Delivery**: Q3 2026
- **Marina Opening**: Spring 2027 (Azure Grand Marina)
- **Investment Horizon**: 2026-2032 projections

### Property Details
- **Project Name**: Azure Bay District
- **Location**: Emerging coastal waterfront (fictional)
- **Unit Types**: Studios, 1BR, 2BR, 3BR apartments
- **Price Range**: €192,000 - €905,000 (est.)
- **Payment Plan**: 40% during construction, 60% post-delivery (1% monthly)

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 16
- **UI Library**: React 18
- **Styling**: Tailwind CSS 4
- **Component System**: Radix UI
- **Animations**: Tailwind CSS Animations
- **Icons**: Lucide React

### Backend & APIs
- **Email Service**: Resend
- **File Storage**: AWS S3
- **PDF Generation**: PDF-Lib
- **Form Validation**: React Hook Form + Zod
- **CRM Integration**: HubSpot
- **Security**: ALTCHA

### Tools & Config
- **Package Manager**: npm
- **Deployment**: Vercel
- **Type Safety**: TypeScript
- **Testing**: Vitest
- **Linting**: ESLint

## 🚀 Getting Started

### Prerequisites
```bash
Node.js 18+ 
npm or yarn
```

### Installation

1. Clone the repository
```bash
git clone https://github.com/ToniIAPro73/v0-landing-page-real-state.git
cd v0-landing-page-real-state
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env.local
```

4. Configure environment variables
```env
# Site Configuration
NEXT_PUBLIC_SITE_URL=https://azurebay-meridian.vercel.app

# Security
RECAPTCHA_ENTERPRISE_PROJECT_ID=your_recaptcha_project_id
RECAPTCHA_ENTERPRISE_KEY_ID=your_recaptcha_key_id
RECAPTCHA_ENTERPRISE_KEY=your_recaptcha_api_key

# HubSpot Integration
HUBSPOT_PORTAL_ID=your_hubspot_portal_id

# ALTCHA Security
ALTCHA_CHALLENGE_ENDPOINT=/api/altcha/challenge

# AWS S3 (optional - for PDF storage)
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=your_aws_region
AWS_S3_BUCKET=your_bucket_name

# Email Service
RESEND_API_KEY=your_resend_api_key
```

5. Run development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

## 📁 Project Structure

```
.
├── app/
│   ├── page.tsx              # Main landing page component
│   ├── layout.tsx            # Root layout with providers
│   ├── HubSpotScript.tsx      # HubSpot integration component
│   └── api/
│       ├── submit-lead.ts     # Lead submission endpoint
│       ├── generate-pdf.ts    # PDF generation endpoint
│       └── altcha/
│           └── challenge.ts   # ALTCHA verification endpoint
├── components/
│   └── ui/                    # Reusable UI components
├── public/
│   ├── assets/                # Images and media
│   ├── hero-background.png    # Hero section background
│   └── logo-playa-viva.png    # Project logo
├── lib/
│   └── utils.ts               # Utility functions
├── styles/
│   └── globals.css            # Global styles
├── .env.example               # Environment variables template
├── next.config.js             # Next.js configuration
├── tailwind.config.ts         # Tailwind CSS configuration
├── tsconfig.json              # TypeScript configuration
└── package.json               # Dependencies
```

## 🔄 Deployment

### Vercel (Recommended)

1. Push to GitHub
```bash
git push origin main
```

2. Import project in [Vercel Dashboard](https://vercel.com)

3. Set environment variables in Vercel project settings

4. Deploy automatically on push to main

**Live URL**: https://azurebay-meridian.vercel.app

## 📝 Content Management

### Bilingual Content
All content is managed in `app/page.tsx` within the `content` object:

```typescript
const content = {
  es: { /* Spanish content */ },
  en: { /* English content */ }
};
```

Sections include:
- Hero section (title, subtitle, description, CTA)
- Marina Effect (investment opportunity narrative)
- Features (development specs, amenities)
- Gallery (visual showcase)
- Apartments (unit specifications and pricing)
- Trust indicators (social proof, news coverage)
- FAQ (investment questions)
- Location (district information)

### Customization

1. **Update property details**: Modify prices, sizes, and unit types in `content[language].apartments`
2. **Change imagery**: Replace files in `/public/assets/`
3. **Update investment narrative**: Edit `content[language].wynnEffect` and `content[language].investment`
4. **Modify payment terms**: Update `content[language].paymentPlan`

## 🔐 Security Features

- **ALTCHA**: Frictionless bot protection
- **Privacy Policy**: Explicit data consent field
- **Email Verification**: Lead validation before processing
- **XSS Protection**: Content sanitization
- **CSRF Protection**: Form token validation
- **Secure Headers**: Security headers in next.config.js

## 📊 Lead Automation Flow

1. User fills contact form
2. ALTCHA verification
3. Privacy consent check
4. Form submission to `/api/submit-lead`
5. Lead data sent to HubSpot
6. PDF dossier generated
7. Email sent via Resend
8. File stored in AWS S3
9. Download link provided
10. User feedback confirmation

## 🎨 Design System

Custom CSS variables for consistent theming:

```css
--color-primary: #32B8C6      /* Teal */
--color-secondary: #6E5F46    /* Brown */
--color-gold-warm: #A29060    /* Gold */
--color-text: #134252         /* Dark Blue */
--color-background: #FFFBF5   /* Cream */
```

## 📱 Responsive Design

- Mobile-first approach
- Breakpoints:
  - sm: 640px
  - md: 768px
  - lg: 1024px
  - xl: 1280px
  - 2xl: 1536px

## 🧪 Testing

Run tests:
```bash
npm run test
```

Run linting:
```bash
npm run lint
```

## 📄 License

MIT License - See LICENSE file for details

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support & Contact

**Project by**: Anclora Cognitive Solutions  
**Lead Developer**: Toni  
**Repository**: https://github.com/ToniIAPro73/v0-landing-page-real-state

---

**Note**: Azure Bay District and Meridian Coastal Group are fictional entities created as a portfolio case study to demonstrate premium real estate landing page design and lead automation capabilities.
