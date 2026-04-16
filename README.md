# MTalk Client

> **"The Ultimate Manhwa & Manhua Social Hub"** — Frontend
> 
> **Live Demo:** [mtalk-client.vercel.app](https://mtalk-client.vercel.app)

This is the Vite + React 18 frontend for the **MTalk** platform. It uses **Tailwind CSS v4**, **Framer Motion**, **TanStack Query v5**, **Zustand**, and **Socket.io-client** for a premium, real-time, glassmorphic dark UI experience.

## 🖥️ Tech Stack
- **React 18** (JSX / plain JavaScript — no TypeScript)
- **Vite 8** with `@tailwindcss/vite` plugin
- **Tailwind CSS v4** — configured via `src/index.css` `@theme` block
- **Framer Motion** — for smooth animations and transitions
- **TanStack Query v5** — data fetching & caching (AniList, Jikan)
- **Zustand** — global state management (auth user, socket)
- **Socket.io-client** — real-time global and per-title chats
- **React Router DOM v6** — client-side routing
- **Lucide React** — icon set

## 📁 Folder Structure
```
client/
├── public/
├── src/
│   ├── api/         # AniList + Jikan API functions
│   ├── components/
│   │   └── layout/ # Navbar, Sidebar, Layout wrapper
│   ├── pages/       # All route-level pages
│   ├── store/       # Zustand global stores
│   ├── App.jsx      # Router + page wiring
│   ├── main.jsx     # React root + QueryClient setup
│   └── index.css    # Tailwind v4 theme + global styles
├── .env.example
├── vite.config.js
└── package.json
```

## ⚙️ Setup & Run

### 1. Install dependencies
```bash
npm install
```

### 2. Environment Variables
Copy and configure the env file:
```bash
cp .env.example .env
```
| Variable | Default | Description |
|---|---|---|
| `VITE_API_URL` | `http://localhost:5005` | Backend Express server URL |

> **Note**: In Vite, all env vars **must** be prefixed with `VITE_` and accessed via `import.meta.env.VITE_*` (not `process.env`).

### 3. Run dev server
```bash
npm run dev
```
App will be available at `http://localhost:5173`.

## 🎨 Theme
- Background: `#0f0f0f` (ComicK.io dark)
- Accent Cyan: `#00f5ff` (neon glow)
- Accent Magenta: `#ff00aa` (neon glow)
- Glassmorphism: `backdrop-blur` + `rgba` surface layers
