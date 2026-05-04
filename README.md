# 🫐 Blackcurrant

A developer utility playground built with React and TypeScript. Blackcurrant bundles a set of everyday developer tools — string transformations, number utilities, browser diagnostics, and an in-browser code editor — into a single fast, installable, offline-capable PWA.

**Live:** [project-blackcurrant.vercel.app](https://project-blackcurrant.vercel.app)

---

## Features

### 🔤 Play with Strings

Transform and manipulate text using a collection of string utilities:

- Alternate Case, Camel Case, Pascal Case, Snake Case, Screaming Snake Case, Kebab Case
- Reverse String, Randomise Case, Remove Whitespace
- Convert to Binary String, Convert to ASCII

### 🔢 Play with Numbers

Run common number operations and conversions:

- Number ↔ HEX, Number ↔ Binary
- Is Prime, Factorial, Fibonacci Sequence
- Sum of Digits, Reverse of Number
- Greatest Common Divisor (GCD), Least Common Multiple (LCM)

### 🌐 Browser Vitals

Inspect browser and device capabilities in real time:

- Network information, geolocation, battery status
- Screen dimensions, device pixel ratio, online/offline state
- User agent details and browser feature detection

### 💻 Coditor Playground

An in-browser code editor powered by Monaco Editor:

- Write and preview React, Vue, and plain HTML/CSS snippets
- Live preview with `@babel/standalone` for JSX transpilation
- Syntax highlighting, editor themes, and language selection

---

## Tech Stack

| Category         | Technology                              |
| ---------------- | --------------------------------------- |
| Framework        | React 19 + TypeScript                   |
| Build Tool       | Vite 5                                  |
| Styling          | TailwindCSS 3 + SCSS                    |
| UI Components    | PrimeReact 10                           |
| Icons            | Lucide React                            |
| Routing          | React Router DOM v7                     |
| State Management | Zustand                                 |
| Code Editor      | Monaco Editor (`@monaco-editor/react`)  |
| Live Preview     | `@babel/standalone`, `react-live`       |
| Fonts            | Bunny Fonts (Acme, Righteous, Urbanist) |
| Deployment       | Vercel                                  |

---

## PWA Support

Blackcurrant is a fully installable Progressive Web App:

- Works **offline** via a custom Service Worker with cache-first strategy
- Installable on desktop and mobile from the browser
- App shortcuts for direct deep-linking to each tool from the home screen

---

## Project Structure

src/
├── Components/ # Shared UI components (Navbar, SideMenu, FeedbackDialog, etc.)
├── Layout/ # App shell layout wrapping all pages
├── Pages/ # Route-level page components
│ ├── HomePage/
│ ├── StringManipulationPage/
│ ├── NumbersPage/
│ ├── WebAPIsPage/
│ ├── CoditorPlayground/
│ ├── DatesPage/
│ └── PageNotFound/
├── Routes/ # React Router configuration (lazy-loaded routes)
├── Services/ # Utility functions, constants, Zustand stores
│ ├── Constants.ts
│ ├── StringFunctions.ts
│ ├── NumberFunctions.ts
│ ├── DateFunctions.ts
│ └── Stores/
└── assets/ # Styles, animations, static assets

---

## Getting Started

**Prerequisites:** Node.js 20+, npm

```bash
# Clone the repo
git clone https://github.com/YashAgarwal1201/Blackcurrant.git
cd Blackcurrant

# Install dependencies
npm install

# Start dev server
npm run dev
# → http://localhost:5353

# Build for production
npm run build

# Preview production build locally
npm run preview
```

---

## Scripts

| Script            | Description                                    |
| ----------------- | ---------------------------------------------- |
| `npm run dev`     | Start Vite dev server at port 5353             |
| `npm run build`   | TypeScript check + production build            |
| `npm run preview` | Serve production build locally                 |
| `npm run host`    | Dev server exposed on LAN (for device testing) |
| `npm run lint`    | ESLint with zero warnings policy               |

---

## Note

Content for this readme file is generated via perplexity. It may have outdated or wrong information.

---

## Author

**Yash Agarwal** — [GitHub](https://github.com/YashAgarwal1201) · [LinkedIn](https://www.linkedin.com/in/yashagarwal1201)
