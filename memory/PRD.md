# İftar Vakti - Prayer Times App PRD

## Original Problem Statement
Build a modern, minimal, high-performance single-page web application that displays daily prayer times with primary focus on Iftar time and a live countdown. Turkish language interface with a culturally authentic Ramadan menu system.

## User Choices
- **API**: Diyanet İşleri Başkanlığı (emushaf.net) for prayer times
- **Menu Data**: Static JSON dataset (ramadanMenus.json) - NO randomization
- **Theme**: Teal green primary color - Dark mode default
- **Language**: Turkish UI
- **Default City**: Erzincan, Turkey
- **Developer Credit**: Seyrani Kenger
- **Deployment Target**: GitHub Pages (static hosting)

## Architecture
- **Development**: React + Tailwind CSS + Shadcn/UI (`/app/frontend/src/App.js`)
- **Production**: Static vanilla HTML/CSS/JS (`/app/dist/`)
- **Prayer API**: Diyanet via ezanvakti.emushaf.net
- **Menu Data**: Embedded MENU_DATA from JSON (deterministic, no randomization)
- **PWA**: Service Worker + manifest.json for offline support
- **Storage**: LocalStorage for preferences

## What's Been Implemented

### Version 5.0 (Feb 19, 2026) - COMPLETE

**Static Menu System (From JSON Dataset):**
- 29-day Ramadan menus loaded from `ramadanMenus.json`
- 3-day Eid special menus
- 5 menu categories per day: Soup, Main Dish, Side, Salad/Meze, Dessert
- **FULLY DETERMINISTIC** - no randomization, same day = same menu
- Works offline in PWA mode

**Special Menu Visual Treatments:**
- **Day 27 (Kadir Gecesi)**: Purple/indigo gradient styling, star badge
- **Eid Days 1-3**: Amber/gold gradient styling, sparkle badge
- **Standard Days**: Default teal primary styling

**Period Detection:**
- Ramadan: Feb 19 - Mar 19, 2026 (29 days)
- Eid: Mar 20 - Mar 22, 2026 (3 days)
- Outside periods: Shows sample Day 1 menu

**All Previous Features (Preserved):**
- Live Iftar countdown (updates every second)
- Ramadan progress bar (Day X of 29, percentage)
- Eid celebration banner with sparkles
- 6 prayer times grid (İmsak, Güneş, Öğle, İkindi, Akşam, Yatsı)
- Akşam (Iftar) highlighted with pulsing green border
- City selector (18 Turkish cities)
- Dark/Light theme toggle (dark default)
- 29-day Ramadan schedule modal with Kadir Gecesi highlight
- PWA with offline support via Service Worker
- URL parameter & localStorage persistence
- Footer with Diyanet and developer attribution
- **NO advertisements or ad placeholders**

## Ramadan 2026 Dates (Official)
- Start: February 19, 2026 (1 Ramazan 1447)
- End: March 19, 2026 (29 Ramazan 1447)
- Kadir Gecesi: March 17, 2026 (27 Ramazan)
- Eid: March 20-22, 2026 (3 days)

## File Structure
```
/app/
├── frontend/
│   ├── src/
│   │   └── App.js              # Main React component (~1118 lines)
│   └── public/
│       └── ramadanMenus.json   # Original JSON dataset
├── dist/                        # Static production build
│   ├── index.html
│   ├── style.css
│   ├── script.js               # Embedded MENU_DATA
│   ├── ramadanMenus.json
│   ├── manifest.json
│   ├── service-worker.js
│   └── icons/
└── prayer-times-pwa.zip        # Final deliverable (21KB)
```

## Deployment Instructions
1. Download `prayer-times-pwa.zip` from `/app/`
2. Extract contents
3. Upload all files to GitHub Pages repository
4. Enable GitHub Pages in repository settings
5. Access via `https://username.github.io/repo-name/`

## Menu Data Structure
```json
{
  "ramadan_menus": [
    { "day": 1, "type": "standard", "soup": "...", "main": "...", ... },
    { "day": 27, "type": "kadir_gecesi_special", ... },
    ...
  ],
  "eid_special_menus": [
    { "day": 1, "type": "eid_special", ... },
    ...
  ]
}
```

## Testing Status
- All 11 core features tested and passing (100% success rate)
- Menu determinism verified across page refreshes
- No console errors
- Dark mode default working
- Countdown accurate
- Day 1 menu displays correctly: Ezogelin Çorbası, Fırın Tavuk But, Pirinç Pilavı, Çoban Salata, Güllaç

## Completed - No Pending Tasks
All requested features have been implemented and tested. The final static build is ready for deployment to GitHub Pages.
