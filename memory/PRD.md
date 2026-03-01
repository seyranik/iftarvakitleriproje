# Namaz Vakitleri - Prayer Time Reminder PWA

## Original Problem Statement
Build a Prayer Time Reminder Progressive Web App (PWA) that displays daily prayer times with Ramadan awareness. The app should request location permission on first visit to auto-detect the user's city, with Erzincan as the default fallback.

## User Requirements (Latest - March 2026)
1. **Default City**: Erzincan
2. **Location Permission Flow**:
   - On first visit, request location permission
   - If granted: Detect user's city and save as default
   - If denied: Use Erzincan as default
3. **City Persistence**: When user selects a different city, save it as the new default
4. **API**: Official Diyanet API (ezanvakti.emushaf.net)
5. **Language**: All UI in Turkish
6. **Design**: Do NOT modify existing design, only add functional features

## Architecture
- **Frontend**: React + Tailwind CSS + Shadcn/UI
- **Prayer API**: Diyanet via ezanvakti.emushaf.net
- **Ramadan Detection**: Aladhan API (api.aladhan.com)
- **PWA**: Service Worker + manifest.json for offline support & notifications
- **Storage**: LocalStorage for user preferences (city, theme, notification settings)
- **Geolocation**: Browser Geolocation API with Haversine formula for nearest city detection

## What's Been Implemented

### Version 6.0 (March 1, 2026) - Location Permission Flow

**Location Permission Feature:**
- Location permission modal on first visit with "Konum İzni" title
- "Hayır, Erzincan" button → Sets Erzincan as default
- "Evet, Konumumu Bul" button → Uses geolocation to detect nearest city
- Loading state while fetching location
- City detection using Haversine formula (all 81 Turkish provinces)
- City preference persists to localStorage

**City Management:**
- All 81 Turkish provinces available in dropdown
- City selection immediately loads new prayer times
- Selected city automatically saved to localStorage
- On app reload, previously selected city is restored

**Notification System:**
- Notification permission prompt appears after location flow
- Prayer time notifications via Service Worker
- Silent mode toggle in settings
- Friday (Jumu'ah) special notification 1 hour before Dhuhr

**Ramadan Features:**
- Ramadan progress bar showing current day and percentage
- "İftar'a Kalan Süre" countdown during Ramadan
- Akşam (Iftar time) highlighted with special styling
- "Ramazan İmsakiyesi" button for monthly calendar

**Prayer Times Grid:**
- 6 prayer times: İmsak, Güneş, Öğle, İkindi, Akşam, Yatsı
- Next prayer highlighted with teal border
- Live countdown timer updating every second
- Prayer times from official Diyanet API

**Friday Features:**
- Friday hadith section with authentic hadiths from Diyanet sources
- Hadith of the day (deterministic based on date)
- Special Friday notification reminder

**Settings:**
- Dark/Light theme toggle (dark default)
- Notifications toggle
- Silent mode toggle
- Calculation method info (Diyanet)

## Ramadan 2026 Dates
- Start: February 19, 2026 (1 Ramazan 1447)
- End: March 19, 2026 (29 Ramazan 1447)
- Current: Day 11 (March 1, 2026)

## File Structure
```
/app/
├── frontend/
│   ├── src/
│   │   └── App.js              # Main React component (~1250 lines)
│   └── public/
│       ├── service-worker.js   # PWA service worker
│       ├── manifest.json       # PWA manifest (already existed)
│       └── icons/              # PWA icons (72-512px)
├── dist/                        # Static production build
│   ├── index.html
│   ├── style.css
│   ├── script.js
│   ├── manifest.json
│   ├── service-worker.js
│   └── icons/
└── memory/
    └── PRD.md                  # This file
```

## API Endpoints Used
- Prayer Times: `https://ezanvakti.emushaf.net/vakitler/{ilceId}`
- Ramadan Detection: `https://api.aladhan.com/v1/hijriCalendar/{year}/9`

## Testing Status (March 1, 2026)
- **Frontend Tests**: 100% pass rate (16/16 tests)
- Location permission modal: ✅
- Default city (Erzincan): ✅
- City persistence: ✅
- All 81 Turkish cities: ✅
- Diyanet API integration: ✅
- Countdown timer: ✅
- Ramadan progress bar: ✅
- Settings modal: ✅
- Turkish UI: ✅

## Prioritized Backlog

### P0 - None (All core features complete)

### P1 - Enhancements
- Add more cities (district-level, not just provinces)
- Add prayer time notifications sound selection
- Add Qibla direction feature

### P2 - Future Features
- Mosque finder integration
- Multiple city comparison view
- Widget for mobile home screen
- Apple Watch/Wear OS companion apps

## Technical Notes
- **Haversine Formula**: Used for calculating distance between user coordinates and city centers
- **City Data**: All 81 Turkish provinces with lat/lng coordinates and Diyanet ilceId
- **Caching**: Prayer times cached in localStorage with date-based keys
- **Service Worker**: Handles notifications and offline caching

## Developer
- Developed by Seyrani Kenger
