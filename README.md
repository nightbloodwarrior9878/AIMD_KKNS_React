# AIMD — KKNS React Prototype

A hackathon-grade React + TypeScript + Vite frontend for:

**AIMD — AI Media Investigation & Detection**

The interface follows the requested workflow:

Upload → Analyze → Explain → Verify → Trace → Report

## Run locally

Requirements:
- Node.js 18+ (20+ recommended)
- npm

```bash
npm install
npm run dev
```

Open the local URL printed by Vite, usually `http://localhost:5173`.

## Production build

```bash
npm run build
npm run preview
```

## Important security note

The prototype stores demo AIMD account records in browser `localStorage` so the UI can demonstrate multiple accounts and session persistence. It does **not** collect or store Google passwords.

For a real deployment:
- use Google OAuth / Google Identity Services for Google sign-in;
- use a server-side auth provider for email/password accounts;
- hash passwords server-side;
- store cases and reports in a database;
- connect the research sweep to authorized search APIs;
- connect real forensic/ML models to the analysis endpoint.

The current analysis engine is clearly labeled **DEMO / SIMULATED** so it does not misrepresent mock scores as forensic evidence.
