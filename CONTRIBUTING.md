# Contributing to Trifecta Performance Lab

Thank you for contributing to the Trifecta Performance Lab project.

## Development Workflow

1. Clone the repository and install dependencies:
   ```bash
   npm ci
   ```
2. Start local development server:
   ```bash
   npm run dev
   ```
3. Run tests and linting before submitting pull requests:
   ```bash
   npm run lint
   npx tsc --noEmit
   npm test
   ```

## Contribution Principles

- **Bilingual Integrity:** Ensure all new UI features support both Arabic (`dir="rtl"`) and English (`dir="ltr"`).
- **Safety First:** Preserve non-compensable Critical Safety Gate enforcement rules in all curriculum and assessment modules.
- **Privacy First:** Never introduce external tracking scripts, cloud database dependencies, or remote data transmission.
- **Parallel Deployment:** Ensure changes compile successfully under both `vinext build` (OpenAI Sites target) and `next build --webpack` (Vercel target).
