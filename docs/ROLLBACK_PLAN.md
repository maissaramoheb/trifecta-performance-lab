# Rollback Plan: Trifecta Performance Lab

## Executive Summary

This document provides clear, actionable rollback procedures for the **Trifecta Performance Lab** application across both Vercel and OpenAI Sites hosting environments.

---

## 1. Instant Vercel Rollback

If a defect or regression is identified on Vercel Production:

1. **Vercel Dashboard Instant Rollback:**
   - Go to Vercel Dashboard → `trifecta-performance-lab` → Deployments.
   - Locate the previous successful deployment.
   - Click `...` → **Instant Rollback**.
   - Deployment reverts in < 5 seconds without requiring a Git commit.

2. **Git Rollback:**
   - Revert the offending commit on `main`:
     ```bash
     git revert HEAD
     git push origin main
     ```
   - Vercel will build and promote the clean revert commit automatically.

---

## 2. OpenAI Sites Fallback / Rollback

The existing OpenAI Sites production deployment (`https://trifecta-performance-lab.maissara.chatgpt.site`) remains active and independent of Vercel.

- **Primary Fallback:** In the event of an outage or issue on Vercel, users can immediately access the OpenAI Sites URL.
- **Rollback Checkpoint:** Local tag `pre-migration-checkpoint` marks the exact state prior to Vercel migration changes.
- **Re-deploying OpenAI Sites:**
  ```bash
  git checkout pre-migration-checkpoint
  npm run build
  ```
  The `.openai/hosting.json` configuration ensures seamless compatibility with OpenAI Sites hosting.

---

## 3. Data Integrity & Storage Considerations

- Because user state is maintained exclusively in browser `localStorage`, rolling back hosting deployments **does not erase or corrupt user data**.
- If user data schema version upgrades occur in future releases, the client application includes backward-compatible schema migration handlers (`schemaVersion: 2`).
