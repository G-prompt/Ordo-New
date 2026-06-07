# ORDO User Guide

Welcome to ORDO — your career operating system for building verified portfolio work, following a career roadmap, and discovering opportunity flow.

## Navigation Overview

### Landing page
- `Sign In`: Open the login form for existing users.
- `Create Account`: Start on a fresh profile to begin your ORDO journey.
- The headline shows ORDO's value: turning certifications and learnings into career-ready work.

### Login / Sign Up
- `Email` and `Password`: Use the demo account or create your own credentials.
- `Password visibility`: Tap the eye icon in the password field to show or hide what you type.
- `Back`: Return to the landing page without submitting.

### Dashboard
After signing in, you land on the dashboard.

#### Top navigation tabs
- `Overview`: Your roadmap, project submission form, opportunity feed, and portfolio snapshot.
- `Portfolio`: A full list of your submitted projects and verification controls.
- `Settings`: Manage your account name, email, and notification preferences.

#### Dashboard loading experience
- ORDO displays a powerful animated logo loader while it refreshes your workspace.
- The logo spins and pulses while the platform fetches your roadmap, portfolio, and opportunities.

## How to use ORDO

### Step 1: Sign in or create an account
- If you already have an account, choose `Sign In` and enter your email and password.
- If not, choose `Create Account`, enter your name, email, and password, and submit.

### Step 2: Explore the Overview page
- Review the `Career roadmap` cards that describe your next skills.
- Use `Submit a project` to add a new work item to your portfolio.
- The `Opportunity feed` surfaces career and mentorship-aligned openings.

### Step 3: Build your portfolio
- Create a project title and provide a repository link.
- Submit the project to add it to your portfolio.
- The platform will fetch the latest data and update your dashboard automatically.

### Step 4: Verify your work
- In the `Portfolio` tab, use the verify action to request assessment of a submitted project.
- ORDO provides verification scores and status messaging for confidence.

### Step 5: Manage your account
- In `Settings`, update your profile name and email.
- Toggle email notifications for roadmap updates and mentorship offers.
- Save changes to persist your information locally.

## Tips for a better ORDO experience
- Keep your project descriptions meaningful so your portfolio is easier to review.
- Use the `Overview` tab as your daily command center for project work and opportunities.
- If the dashboard looks blank after login, wait for the brief animated reload: ORDO is fetching fresh data.

## Project structure
- `src/App.jsx`: Main React interface and dashboard experience.
- `src/index.css`: Tailwind and animation styles.
- `server.js`: Demo backend that powers auth, roadmap, portfolio, verification, and opportunities.
- `data.json`: Mock persistence for users, projects, portfolio items, and opportunity feed.

## New site and app pages
- `About`: Company and vision overview.
- `Guide`: A new onboarding page that explains ORDO’s purpose, key workflows, and how the platform solves the project-to-career problem.
- `Contact`: Send messages to the team (backed by Formspree and `/api/v1/contact`). Official inbox: ordo.contact.me1@gmail.com
- `Pricing`: Example subscription plans.
- `Docs`: Helpful docs and API notes.
- `Terms` / `Privacy`: Legal notices for prototype use.
- `Project detail`, `Verification`, `Opportunities`, `Admin`: App scaffolds for deeper workflows.

## AI Assistant
The dashboard includes a simple AI Assistant powered by AI. To enable it, set the environment variable `VUYAR_API_KEY` (or `GEMINI_API_KEY` for backward compatibility) on the server (not committed to source). The assistant is accessible from the Dashboard Overview and sends prompts to the server at `/api/v1/ai/assist` which proxies requests to the configured AI service. Built by Team Turing.

Example (Linux / macOS):
```
export VUYAR_API_KEY="sk-..."
npm run dev
```

Example (Windows PowerShell):
```
$env:VUYAR_API_KEY="sk-..."
npm run dev
```

## Running the app
1. Install dependencies: `npm install`
2. Run in development: `npm run dev`
3. Open http://localhost:3000

## Notes
- ORDO is currently a demo prototype. Data resets when the server restarts.
- For production, the next step is a database-backed API, secure JWTs, and real persistence.
