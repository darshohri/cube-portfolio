# Interactive 3D Portfolio

A fully immersive, interactive 3D portfolio website built to showcase my projects, skills, and experience in a unique spatial environment.

Live site: https://darshohri.vercel.app

## Tech stack

- **UI:** React 19 and TypeScript, bundled with Vite
- **3D:** Three.js with `@react-three/fiber` and `@react-three/drei`
- **Styling and motion:** Tailwind CSS 4 and Motion
- **Backend:** Firebase client config and a Vercel edge function (`api/like.ts`) backed by Upstash Redis for the like counter
- **Resume export:** `html2pdf.js`

## Getting started

Prerequisites: Node.js 18 or newer and npm.

```bash
npm install
cp .env.example .env.local   # then fill in your own values
npm run dev                  # http://localhost:3005
```

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the Vite dev server on port 3005 |
| `npm run build` | Create a production build in `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Type-check the project with `tsc --noEmit` |
| `npm run clean` | Remove build output |

## Environment variables

Copy `.env.example` and set your own values. It lists the Gemini and Firebase client settings the app reads. The like counter needs `KV_REST_API_URL` and `KV_REST_API_TOKEN`, which Vercel adds when an Upstash Redis store is connected to the project. Without them, `api/like.ts` returns a placeholder count so the site still runs locally.

## Project structure

```
api/        Vercel edge function for the like counter
public/     Static assets
src/        App entry point (main.tsx), main component (App.tsx) and global styles
Resume/     Resume files
```

## Deployment

The site is deployed on Vercel. The `api/` folder runs as a Vercel function.
