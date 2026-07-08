# StartupGig

StartupGig is an AI-powered smart freelance talent matching platform for startups.

## Monorepo Structure

- `client`: React + Vite frontend
- `server`: Node.js + Express + MongoDB backend

## Quick Start

1. Install dependencies

```bash
npm run install:all
```

2. Configure environment files

- `server/.env`
- `client/.env` (optional)

3. Run in development mode

```bash
npm run dev
```

Frontend runs on `http://localhost:5173` and backend on `http://localhost:5000`.

## Core Features Implemented

- Role-based auth (startup, freelancer, admin)
- Startup and freelancer dashboards
- Projects and applications APIs
- Explainable AI smart matching with confidence score and hiring lane
- Match risk radar with actionable mitigation recommendations
- Startup health and freelancer trust scoring
- AI project requirement analyzer with complexity, risk level, and milestone plan
- AI resume analyzer with market positioning and profile strength
- Team builder with role focus and collaboration model
- Skill gap analysis with prioritized gaps and 30-60-90 roadmap
- AI proposal generator with startup-focused differentiation framing
