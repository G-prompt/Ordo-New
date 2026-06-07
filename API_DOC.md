# ORDO Prototype API Documentation (v1)

This document lists the prototype API endpoints implemented in `server.js` and their expected payloads.

Base: `/api/v1`

## Auth
- POST `/auth/register`
  - Body: { name?: string, email: string, password: string }
  - Response: { id, name, email }

- POST `/auth/login`
  - Body: { email: string, password: string }
  - Response: { token, user: { id, name, email } }

## Users
- GET `/users/me`
  - Headers: `Authorization: <token>`
  - Response: { id, name, email, profile }

## Onboarding
- POST `/onboard`
  - Headers: `Authorization: <token>`
  - Body: { goals: string[], baselineSkills?: string[] }
  - Response: { ok: true, profile }

## Career
- POST `/career/roadmap`
  - Headers: `Authorization: <token>`
  - Body: { goal: string }
  - Response: roadmap object: { goal, skills[], courses[], projects[] }

## Projects
- GET `/projects/recommendations`
  - Headers: `Authorization: <token>`
  - Response: [project]

- POST `/projects/submit`
  - Headers: `Authorization: <token>`
  - Body: { title: string, description?: string, repositoryUrl?: string }
  - Response: project object

- GET `/projects`
  - Headers: `Authorization: <token>`
  - Response: [project]

## Portfolio
- GET `/portfolio/:userId`
  - Response: [portfolioItem]

## Verification
- POST `/verify/assess`
  - Headers: `Authorization: <token>`
  - Body: { projectId: string }
  - Response: { id, projectId, assessor, score, verifiedAt }

- POST `/review/submit` (peer review)
  - Headers: `Authorization: <token>`
  - Body: { projectId: string, score: number, comment?: string }
  - Response: verification record


## Opportunities
- GET `/opportunities/feed`
  - Headers: `Authorization: <token>`
  - Response: [opportunity]

## Mentors
- POST `/mentors/request`
  - Headers: `Authorization: <token>`
  - Body: { topic: string }
  - Response: { assigned: mentor }


Notes:
- This is a prototype in-memory server; data is not persistent across restarts.
- For a production system, swap in a persistent DB (Postgres), secure token management (JWT), rate-limiting, and production-ready auth flows (OAuth, SSO).
