# Security Policy

## Security Model

**Trifecta Performance Lab** is a local-first web application designed for privacy-sensitive training assessment.

- **Local Storage Only:** All application data, station configurations, and assessment drafts remain strictly within the user's browser `localStorage`.
- **Zero Remote Data Ingestion:** The application contains no backend APIs, analytics scripts, tracking pixels, or remote database connectors.
- **Zero Secret Exposure:** No API keys, credentials, tokens, or environment secrets are embedded in source code or client bundles.

## Reporting a Vulnerability

If you discover a security issue or potential privacy vulnerability in this application, please report it privately:

- **Email:** `delta.4ce.20@gmail.com`
- Do not disclose security issues publicly until they have been reviewed and resolved.

## Dependency Security

All dependencies are monitored via `npm audit`. Security fixes are reviewed and applied prior to production deployments.
