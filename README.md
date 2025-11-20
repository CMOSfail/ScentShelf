# ScentShelf

ScentShelf is a small, local-first web app for cataloguing a personal
perfume collection.

You can:

-   Add each perfume with a name, brand, picture (file upload or URL),
    and optional **Fragrantica** link.
-   Store extra details such as seasonality (Winter/Summer), style tags
    (Fresh, Sweet, Office, Clubbing...), and notes.
-   Filter and browse by tags to quickly pick what to wear or show your
    collection to friends.

> This project is intended to be hosted locally (for example, on a
> Windows machine at home) and accessed from both desktop and mobile
> browsers on the same network.

## Features (current & planned)

-   📦 **Perfume library**
    -   Grid / list view of all perfumes
    -   Each item shows at least: name, brand, and image
-   🔍 **Details view**
    -   Clicking a perfume opens a detail view with full information
    -   Optional Fragrantica URL stored per perfume
-   🏷️ **Tags & filtering**
    -   Tags like `Winter`, `Summer`, `Fresh`, `Office`, `Date`, etc.
    -   Ability to filter the collection by one or more tags
    -   Ability to add new tags from inside the app
-   📱 **Responsive layout**
    -   UI designed to work both on desktop and mobile screens
-   💾 **Backend-free**
    -   Frontend-only project using a small, well-structured JSON /
        client-side state (no big DB, no external backend)

## Tech stack

-   **Build tool:** Vite
-   **Language:** JavaScript (ESNext)
-   **Framework / UI:** React-style SPA (via Vite template)
-   **Styling:** Tailwind CSS
-   **Component registry:** shadcn/ui
-   **Tooling:** ESLint, PostCSS

## Getting started

### 1. Prerequisites

Install:

-   Node.js (LTS)
-   npm
-   Git

### 2. Clone the repository

``` bash
git clone https://github.com/CMOSfail/ScentShelf.git
cd ScentShelf
```

### 3. Install dependencies

``` bash
npm install
```

## Running the app locally

``` bash
npm run dev
```

Then open the printed URL (usually `http://localhost:5173`).

## Building for production

``` bash
npm run build
npm run preview
```

## Hosting on Windows (local network)

``` powershell
git clone https://github.com/CMOSfail/ScentShelf.git
cd ScentShelf
npm install
npm run build
npm run preview -- --host 0.0.0.0 --port 4173
```

Then access:

    http://<WINDOWS_IP>:4173

## Data model (perfume entries)

``` ts
type Perfume = {
  id: string;
  name: string;
  brand: string;
  imageUrl?: string;
  imageFileName?: string;
  house?: string;
  year?: number;
  concentration?: "EDT" | "EDP" | "Parfum" | string;
  tags: string[];
  season?: string[];
  occasions?: string[];
  notes?: string;
  fragranticaUrl?: string;
};
```

## Development scripts

-   `npm run dev`
-   `npm run build`
-   `npm run preview`

## Contributing / future ideas

-   Search bar
-   Random pick button
-   Export/import JSON
-   Multiple collections
-   Stats view

## License

MIT (or add your own)
