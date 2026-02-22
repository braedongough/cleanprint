# Clean Print

A web application that converts articles into beautifully formatted, print-ready layouts. Extract content from any URL or raw HTML, customize the formatting, and print with optimized typography.

## Features

- **URL extraction** - Paste a URL to automatically extract and clean article content
- **Raw HTML support** - Paste HTML directly for manual article extraction
- **Customizable typography** - Choose font, font size, and column layout (1-3 columns)
- **Image management** - Selectively include or exclude individual images
- **Metadata controls** - Toggle author and date visibility
- **Print-optimized** - Justified text, drop caps, smart page breaks, orphan/widow control

## Tech Stack

- **Runtime**: [Bun](https://bun.sh)
- **Frontend**: React, Tailwind CSS, TypeScript
- **Content extraction**: [@mozilla/readability](https://github.com/nicolevanderhoeven/readability), JSDOM

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) v1.3.5+

### Install dependencies

```bash
bun install
```

### Run in development mode

```bash
bun run dev
```

The app will be available at `http://localhost:3000`.

### Run in production mode

```bash
bun run start
```

### Docker

```bash
docker build -t cleanprint .
docker run -p 3000:3000 cleanprint
```

## Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT`   | `3000`  | Server port |

## Project Structure

```
├── server.ts              # Bun HTTP server with API routes
├── public/
│   └── index.html         # HTML entry point
├── src/
│   ├── main.tsx           # React root entry point
│   ├── App.tsx            # Main app component
│   ├── types.ts           # Shared TypeScript types
│   ├── styles.css         # Global + print styles
│   ├── components/
│   │   ├── InputScreen.tsx
│   │   ├── ArticlePreview.tsx
│   │   ├── SettingsSidebar.tsx
│   │   └── ImageToggle.tsx
│   └── hooks/
│       └── useArticle.ts  # Article fetching logic
```
