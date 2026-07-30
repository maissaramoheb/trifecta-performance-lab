# Vercel Deployment Guide: Trifecta Performance Lab

## Overview

This guide documents the procedures for deploying **Trifecta Performance Lab** to Vercel while maintaining the existing OpenAI Sites deployment intact as a primary/fallback option.

---

## Architecture & Build Strategy

The repository supports dual build targets:

| Target | Command | Output | Runtime |
| :--- | :--- | :--- | :--- |
| **OpenAI Sites** | `npm run build` | `dist/server/index.js` | Cloudflare Worker (`vinext`) |
| **Vercel** | `npm run build:vercel` | `.next/` | Vercel Next.js App Router |

---

## Deployment Steps

### 1. GitHub Integration
- GitHub Repository: `trifecta-performance-lab` (Private)
- Primary Branch: `main`
- Migration Branch: `migration/vercel-production`

### 2. Vercel Project Setup
- Vercel Project Name: `trifecta-performance-lab`
- Framework Preset: Next.js
- Build Command: `npm run build:vercel` (configured via `vercel.json`)
- Output Directory: `.next` (default Next.js output)

### 3. Vercel Preview Deployment
- Branch: `migration/vercel-production`
- Trigger: Push commit or manual deployment via Vercel CLI (`vercel`)
- Access: Password or Vercel Authentication protected.

### 4. Validation Gate
Run the comprehensive test matrix against the Preview deployment:
- Functional (Station Builder, Curriculum, AAR, Gate Logic, Local Storage)
- Arabic & RTL layout mirroring
- PWA installability and offline caching
- Safari chunk reload resilience
- Critical Safety Gate No-Go enforcement

### 5. Vercel Production Deployment
- Merge `migration/vercel-production` into `main`.
- Vercel automatically deploys `main` to Production URL.
- Verify production deployment using the validation matrix.

---

## Maintenance & Updates

When updating the application:
1. Make changes on a feature branch.
2. Run `npm test` locally to verify both OpenAI Sites and Vercel builds.
3. Push to GitHub to generate Vercel Preview.
4. Validate Preview before merging to `main`.
