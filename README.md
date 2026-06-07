# Blackcurrant

A developer utility playground built with React and TypeScript. Blackcurrant bundles a collection of everyday developer tools — string transformations, number utilities, browser diagnostics, and an in-browser code editor — into a single fast, installable, offline-capable PWA.

**Live:** [project-blackcurrant.vercel.app](https://project-blackcurrant.vercel.app)

---

## Features

### String Utilities

Transform and manipulate text with a wide range of case and encoding operations:

- Alternate Case, Camel Case, Pascal Case, Snake Case, Screaming Snake Case, Kebab Case
- Reverse String, Randomise Case, Remove Whitespace
- Convert to Binary String, Convert to ASCII

### Number Utilities

Run common number operations and conversions:

- Number ↔ HEX, Number ↔ Binary
- Is Prime, Factorial, Fibonacci Sequence
- Sum of Digits, Reverse of Number
- Greatest Common Divisor (GCD), Least Common Multiple (LCM)

### Browser Vitals

Inspect browser and device capabilities in real time:

- Network information, geolocation, battery status
- Screen dimensions, device pixel ratio, online/offline state
- User agent details and browser feature detection

### Coditor Playground

An in-browser code editor powered by Monaco Editor:

- Write and preview React, Vue, and plain HTML/CSS snippets
- Live preview with `@babel/standalone` for JSX transpilation
- Syntax highlighting, editor themes, and language selection

---

## Tech Stack

| Category          | Technology                              |
| ----------------- | --------------------------------------- |
| Framework         | React 19 + TypeScript                   |
| Build Tool        | Vite 8                                  |
| Styling           | Tailwind CSS 4 + SCSS                   |
| UI Components     | PrimeReact 10                           |
| Icons             | Lucide React                            |
| Routing           | React Router DOM v7                     |
| State Management  | Zustand                                 |
| Code Editor       | Monaco Editor (`@monaco-editor/react`)  |
| Live Preview      | `@babel/standalone`, `react-live`       |
| Linting           | oxlint                                  |
| Formatting        | oxfmt                                   |
| Fonts             | Bunny Fonts (Acme, Righteous, Urbanist) |
| Deployment        | Vercel                                  |

---

## PWA Support

Blackcurrant is a fully installable Progressive Web App:

- Works offline via a custom Service Worker with a cache-first strategy
- Installable on desktop and mobile directly from the browser
- App shortcuts for direct deep-linking to each tool from the home screen

---

## Project Structure

```
src/
├── Components/       # Shared UI components (Navbar, SideMenu, FeedbackDialog, etc.)
├── Layout/           # App shell layout wrapping all pages
├── Pages/            # Route-level page components
│   ├── HomePage/
│   ├── StringManipulationPage/
│   ├── NumbersPage/
│   ├── WebAPIsPage/
│   ├── CoditorPlayground/
│   ├── DatesPage/
│   └── PageNotFound/
├── Routes/           # React Router configuration (lazy-loaded routes)
├── Services/         # Utility functions, constants, Zustand stores
│   ├── Constants.ts
│   ├── StringFunctions.ts
│   ├── NumberFunctions.ts
│   ├── DateFunctions.ts
│   └── Stores/
└── assets/           # Styles, animations, static assets
```

---

## Getting Started

**Prerequisites:** Node.js 24+, npm

```bash
# Clone the repository
git clone https://github.com/YashAgarwal1201/Blackcurrant.git
cd Blackcurrant

# Install dependencies
npm install

# Start the dev server
npm run dev
# → http://localhost:5353

# Build for production
npm run build

# Preview the production build locally
npm run preview
```

---

## Scripts

| Script              | Description                                      |
| ------------------- | ------------------------------------------------ |
| `npm run dev`       | Start Vite dev server at port 5353               |
| `npm run build`     | TypeScript check + production build              |
| `npm run preview`   | Serve production build locally                   |
| `npm run host`      | Dev server exposed on LAN for device testing     |
| `npm run lint`      | Run oxlint across the codebase                   |
| `npm run lint:fix`  | Run oxlint with auto-fix                         |
| `npm run fmt`       | Format all files with oxfmt                      |
| `npm run fmt:check` | Check formatting without writing changes         |
| `npm run check`     | Lint + format check (used in CI)                 |

---

## Author

**Yash Agarwal** — [GitHub](https://github.com/YashAgarwal1201) · [LinkedIn](https://www.linkedin.com/in/yashagarwal1201)
