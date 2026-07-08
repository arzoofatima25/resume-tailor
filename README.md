# Tailorly — AI Resume & Cover Letter Tailor

Tailorly analyzes a resume against a job description with Google's Gemini API and
returns a structured, ATS-style breakdown: match score, missing skills, an improved
summary and experience bullets, ATS suggestions, strengths/weaknesses, and a tailored
cover letter — all downloadable as a formatted PDF.

## Features

- Real authentication with Firebase — Google sign-in and email/password,
  protected dashboard routes, and an editable profile (name synced from Google
  or set manually)
- Upload a resume (PDF / DOCX / TXT) or paste resume text
- Paste a job description with live character counting
- Choose which AI outputs you want (summary, experience, cover letter, missing
  skills, match score, ATS optimization)
- Gemini returns **strict structured JSON** (no markdown, no prose) validated with
  Zod on the server before it ever reaches the client
- Animated results page with a circular match-score gauge, skill badges, and
  copy / download (PDF or plain text) actions
- Local resume history (browser-side) with favorites and search
- Full dark / light theme with instant switching
- Responsive, accessible (keyboard nav, ARIA labels, visible focus states) UI

## Tech Stack

**Frontend** — React 18, TypeScript, Vite, Tailwind CSS, React Router, Framer Motion,
Lucide icons, React Hook Form + Zod

**Backend** — Node.js, Express, TypeScript, `@google/generative-ai` (Gemini),
Multer, `pdf-parse`, `mammoth`, `pdfkit`, Zod, Helmet, rate limiting

## Project Structure

```
resume-tailor/
├── frontend/                  # React + Vite app
│   └── src/
│       ├── components/
│       │   ├── ui/            # Button, Card, Modal, Toast, Badge, ProgressCircle...
│       │   ├── layout/        # Navbar, Footer, Sidebar, Topbar, DashboardLayout
│       │   └── landing/       # Hero, Features, HowItWorks, FAQ, Testimonials...
│       ├── pages/
│       │   ├── auth/          # Login, Signup, Forgot Password (placeholders)
│       │   ├── dashboard/     # Overview, History, Settings
│       │   ├── workflow/      # The 4-step tailoring wizard
│       │   └── results/       # Results page
│       ├── context/           # Theme + Toast providers
│       ├── hooks/             # useHistory (localStorage)
│       ├── services/          # Axios instance + resume API calls
│       ├── constants/, types/
│       └── App.tsx, main.tsx
│
└── backend/                    # Express API
    └── src/
        ├── routes/resume.routes.ts
        ├── controllers/resume.controller.ts
        ├── services/            # gemini.service, fileParser.service, pdf.service
        ├── middleware/          # upload (multer), validate (zod), errorHandler
        ├── validation/          # zod schemas
        ├── types/
        └── app.ts, server.ts
```

## Getting Started

### Prerequisites

- Node.js 18+
- A Gemini API key from [Google AI Studio](https://aistudio.google.com/apikey)

### 1. Backend

```bash
cd backend
cp .env.example .env
# edit .env and set GEMINI_API_KEY=your_key_here
npm install
npm run dev        # http://localhost:5000
```

### 2. Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev         # http://localhost:5173
```

The frontend dev server proxies `/api` to `http://localhost:5000` (see
`vite.config.ts`), so no CORS configuration is needed locally.

## Environment Variables

**backend/.env**

| Variable | Description |
|---|---|
| `PORT` | API port (default `5000`) |
| `CLIENT_ORIGIN` | Allowed CORS origin, e.g. `http://localhost:5173` |
| `GEMINI_API_KEY` | **Required.** Your Gemini API key — never commit this |
| `GEMINI_MODEL` | Defaults to `gemini-1.5-flash` |
| `MAX_UPLOAD_MB` | Max resume upload size in MB (default `5`) |

## Authentication (Firebase)

Login, Signup, and Forgot Password are wired to real [Firebase Authentication](https://firebase.google.com/docs/auth) — Google sign-in and email/password. Dashboard routes are protected and redirect to `/login` if you're not signed in. Settings shows and lets you edit your real display name.

### Set it up

1. Create a project at the [Firebase console](https://console.firebase.google.com/).
2. **Build → Authentication → Get started**, then enable the **Google** and **Email/Password** sign-in providers.
3. **Project settings → General → Your apps → Add app → Web**, copy the config values.
4. Paste them into `frontend/.env` (see table below).
5. If you use Google sign-in, add `localhost` (already default) and your deployed domain under **Authentication → Settings → Authorized domains**.

Until these env vars are set, the app runs with a visible "Firebase isn't configured" notice on the auth pages and sign-in buttons will show a clear error instead of failing silently.

**frontend/.env**

| Variable | Description |
|---|---|
| `VITE_API_BASE_URL` | Base URL of the backend API |
| `VITE_FIREBASE_API_KEY` | Firebase Web API key |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase auth domain, e.g. `your-project.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | Firebase project ID |
| `VITE_FIREBASE_APP_ID` | Firebase Web app ID |

## API

### `POST /api/resume/analyze`
Accepts either `multipart/form-data` (field `resumeFile`, plus `jobDescription`,
`options` as a JSON string, optional `candidateName`) or a JSON body
`{ resumeText, jobDescription, options, candidateName }`.

Returns `{ success: true, data: ResumeAnalysis }`.

### `POST /api/resume/pdf`
Body: `{ analysis: ResumeAnalysis, candidateName? }`. Returns a PDF file stream.

## Running Locally (both servers)

Open two terminals — one in `backend/` running `npm run dev`, one in `frontend/`
running `npm run dev` — then visit `http://localhost:5173`.

## Deployment

- **Frontend → Vercel:** import the `frontend/` directory as the project root,
  set `VITE_API_BASE_URL` to your deployed backend URL as an environment variable.
- **Backend → Render / Railway:** import the `backend/` directory, set the build
  command to `npm install && npm run build`, start command `npm start`, and add
  `GEMINI_API_KEY`, `CLIENT_ORIGIN` (your Vercel URL), and `PORT` as environment
  variables.

## Future Improvements

- Persist resume history server-side per user (keyed by Firebase UID) instead of `localStorage`
- Let users set a password / link providers from Settings (e.g. add email/password to a Google-only account)
- Multi-resume comparison against one job description
- Streaming Gemini responses for perceived-latency improvements
- Automated tests (Vitest for the frontend, Supertest for the API)

## License

MIT — free to use for learning or as a portfolio project.
