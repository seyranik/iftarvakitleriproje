# İftar Vakti - Prayer Times App PRD

## Original Problem Statement
Build a modern, minimal, high-performance single-page web application that displays daily prayer times with primary focus on Iftar time and a live countdown. Turkish language interface.

## User Choices
- **API**: Diyanet İşleri Başkanlığı (emushaf.net)
- **Theme**: Teal green primary color - Dark mode default
- **Language**: Turkish UI
- **Default City**: Erzincan, Turkey
- **Developer Credit**: Seyrani Kenger
- **Deployment Target**: GitHub Pages (static hosting)

## Architecture
- **Development**: React + Tailwind CSS + Shadcn/UI (`/app/frontend/src/App.js`)
- **Production**: Static vanilla HTML/CSS/JS (`/app/dist/`)
- **API**: Diyanet Prayer Times via ezanvakti.emushaf.net
- **PWA**: Service Worker + manifest.json
- **Storage**: LocalStorage for preferences and menu cache

## What's Been Implemented

### Version 4.0 (Feb 19, 2026) - COMPLETE

**Iftar Menu System (NEW):**
- 29-day deterministic, non-repeating daily menu system
- Covers Feb 19, 2026 – Mar 19, 2026 (full Ramadan period)
- 7 menu items per day: Soup, Main Dish, Side Dish, Salad, 2 Mezes, Dessert
- Uses seeded Mulberry32 random algorithm for consistency
- Same Ramadan day = same menu (deterministic)
- Cached in localStorage as `ramadan-menus-2026`
- Beautifully styled card with colored icons per category

**Static Build Complete:**
- Full vanilla JS version in `/app/dist/`
- Independent from React runtime
- Ready for GitHub Pages deployment
- ZIP archive: `/app/prayer-times-pwa.zip` (20KB)

**All Previous Features (Preserved):**
- Live Iftar countdown (updates every second)
- Ramadan progress bar (Day X of 29, percentage)
- 6 prayer times grid (İmsak, Güneş, Öğle, İkindi, Akşam, Yatsı)
- Akşam (Iftar) highlighted with pulsing green border
- City selector (18 Turkish cities)
- Dark/Light theme toggle (dark default)
- 29-day Ramadan schedule modal
- PWA with offline support via Service Worker
- URL parameter & localStorage persistence
- Footer with Diyanet and developer attribution

## Ramadan 2026 Dates (Official)
- Start: February 19, 2026 (1 Ramazan 1447)
- End: March 19, 2026 (29 Ramazan 1447)
- Eid: March 20, 2026
- Duration: 29 days

## File Structure
```
/app/
├── frontend/              # React development source
│   └── src/
│       └── App.js         # Main component (~1060 lines)
├── dist/                  # Static production build
│   ├── index.html         # Main HTML
│   ├── style.css          # All CSS (utility classes + theme)
│   ├── script.js          # All JS logic
│   ├── manifest.json      # PWA manifest
│   ├── service-worker.js  # Offline caching
│   └── icons/
│       ├── icon-192.png
│       └── icon-512.png
└── prayer-times-pwa.zip   # Final deliverable
```

## Deployment Instructions
1. Download `prayer-times-pwa.zip` from `/app/`
2. Extract contents
3. Upload all files to GitHub Pages repository
4. Enable GitHub Pages in repository settings
5. Access via `https://username.github.io/repo-name/`

## Technical Details
- **Menu Algorithm**: SeededRandom class (Mulberry32) with seed `2026 * 1000`
- **API Caching**: Daily cache by `diyanet-times-{ilceId}-{date}`
- **Ramadan Cache**: `ramadan-full-{ilceId}-2026`
- **Theme Cache**: `prayer-theme` (defaults to "dark")
- **City Cache**: `prayer-city` (JSON object)

## Testing Status
- All 10 core features tested and passing (100% success rate)
- No console errors
- No layout shifts
- Dark mode default working
- Countdown accurate
- Menu displays correctly for Day 1

## Completed - No Pending Tasks
All requested features have been implemented and tested. The final static build is ready for deployment to GitHub Pages.
