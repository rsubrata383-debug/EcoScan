# EcoScan — Scan, Learn, Sort

A simple AI-powered waste scanning app for college exhibitions. Take a photo of waste, get the correct bin, and learn proper disposal.

## Features (6 Core)

1. **Camera Scan** — Take a photo with camera or upload from gallery. Clear message if camera permission denied.
2. **AI Detection** — Sends photo to Spring Boot backend (`POST /api/scan`) which calls Google Gemini.
3. **Result Screen** — Shows item name, correct bin (color + icon), and one-line tip.
4. **Demo Mode** — Works when AI is off. Loads items from `GET /api/demo` and results from `GET /api/demo/{id}`.
5. **Sorting Game** — Tap one of 4 bins (Recyclable/Organic/Non-recyclable/Special). Shows Correct/Wrong with right answer.
6. **Eco Points** — +10 per correct answer, saved in localStorage (`ecoscan_points`), shown in navbar.

## Pages (2)

- `/` — Home: title, one sentence, "Start Scan" and "Try Demo" buttons.
- `/scanner` — Scanner: camera/upload, result, 4 bins, points.
- Unknown routes redirect to `/`.

## Tech Stack

- **Frontend:** React 19 + TypeScript + Vite + Tailwind CSS v4 + shadcn/ui + Framer Motion + React Router
- **Backend:** Spring Boot (separate repo, runs on `http://localhost:8080`)
- **AI:** Google Gemini (called from backend, never from browser)

## Architecture

```
┌─────────────┐     HTTP/JSON      ┌──────────────┐     ┌─────────────┐
│  Browser    │ ◄─────────────────► │ Spring Boot  │ ◄──► │ Google      │
│  (React)    │  /api/scan         │  (Java)      │      │  Gemini     │
└─────────────┘                    └──────────────┘      └─────────────┘
       │
       │  getUserMedia / file input
       ▼
┌─────────────┐
│  Camera     │
│  / Gallery  │
└─────────────┘
```

## Backend API (already built)

Base URL: `http://localhost:8080`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/status` | Returns `{ "aiEnabled": boolean }` |
| POST | `/api/scan` | Multipart form-data `image` → `WasteResult` |
| GET | `/api/demo` | Returns `DemoItem[]` |
| GET | `/api/demo/{id}` | Returns `WasteResult` |

**WasteResult:**
```json
{
  "itemName": "Plastic Bottle",
  "category": "Plastic",
  "bin": "recyclable",
  "tip": "Rinse and recycle. Cap on."
}
```

**Errors:** JSON `{ "message": string }` with status 400, 404, 413, 502, 503.

## Getting Started

### Prerequisites
- Node.js 18+
- Java 21 + Maven (for backend)

### Frontend

```bash
cd ecoscan
npm install
cp .env.example .env
npm run dev
```
Runs on `http://localhost:5173`. The Vite dev proxy forwards `/api/*` to `http://localhost:8080`.

### Backend

```bash
# In your Spring Boot project
mvn spring-boot:run
```
Runs on `http://localhost:8080`.

### Production (Single JAR)

1. `npm run build` → creates `dist/`
2. Copy `dist/` contents to Spring Boot `src/main/resources/static/`
3. Add Spring config for SPA fallback:
```java
@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        registry.addViewController("/**").setViewName("forward:/index.html");
    }
}
```
4. Package: `mvn package` → single JAR serves both frontend and API.

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_BASE_URL` | `""` (empty) | Backend base URL. Empty = same origin (uses Vite proxy in dev). |

## Test Checklist

- [ ] **Demo mode** — Backend stopped, click "Try Demo", select item, tap bins, verify points.
- [ ] **Gallery upload** — Click "Upload Photo", pick image, verify result.
- [ ] **Camera** — Grant permission, tap "SCAN", verify result.
- [ ] **Permission denied** — Block camera, verify clear message + fallback to upload/demo.
- [ ] **Wrong file type** — Upload non-image, verify friendly error.
- [ ] **Backend stopped** — Kill backend, scan, verify "Cannot reach server" message.
- [ ] **AI off** — Backend returns `aiEnabled: false`, verify banner + demo only.
- [ ] **Unknown item** — Backend returns `itemName: "Unknown"`, verify tip + retry button (no game).
- [ ] **Wrong bin answer** — Tap wrong bin, verify "Wrong" + correct bin shown.
- [ ] **Points persist** — Earn points, refresh page, verify points remain.

## Project Structure (src/)

```
src/
├── components/
│   ├── common/           # GlassCard, Logo, Navbar, ScanLine, CornerMarkers, PulseRing, ProgressBar
│   ├── ui/               # Button, Badge, Dialog, Card, etc. (shadcn/ui)
│   └── feedback/         # PointsAnimation
├── context/
│   └── NavbarContext.tsx # Simple navbar config (logo, points, callbacks)
├── features/
│   ├── landing/
│   │   └── components/HeroSection.tsx
│   ├── scanner/
│   │   ├── components/CameraView.tsx, ScanStatus.tsx
│   │   └── hooks/useCamera.ts
│   ├── sorting/
│   │   └── components/RecyclingBins.tsx, SuccessAnimation.tsx
│   └── waste/
│       ├── components/WasteInfoPanel.tsx
│       ├── binInfo.ts         # Bin colors, labels, icons, descriptions
│       └── types.ts           # WasteResult, DemoItem, BinType
├── lib/
│   ├── api.ts           # Backend calls (getStatus, scanImage, getDemoItems, getDemoResult)
│   ├── image.ts         # resizeImage() for camera frames & uploads
│   └── utils.ts         # cn() helper
├── pages/
│   ├── LandingPage.tsx
│   └── ScannerPage.tsx
├── hooks/
│   ├── use-mobile.ts
│   └── useTheme.ts
├── App.tsx
├── main.tsx
└── styles/index.css
```

## License

MIT — Educational demo.