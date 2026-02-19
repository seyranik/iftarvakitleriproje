# İftar Vakti - Prayer Times App PRD

## Original Problem Statement
Build a modern, minimal, high-performance single-page web application that displays daily prayer times with primary focus on Iftar time and a live countdown. Turkish language interface.

## User Choices
- **API**: Diyanet İşleri Başkanlığı (emushaf.net) - Official Turkish Religious Affairs data
- **Theme**: Light mint green (soft, calm, modern) - Dark mode default
- **Features**: Minimal - no prayer sounds, no Qibla compass
- **Icons**: Placeholder PWA icons (mosque/crescent design)
- **Language**: Turkish only
- **Default City**: Erzincan, Turkey

## Architecture
- **Frontend**: React + Tailwind CSS + Shadcn/UI
- **API**: Diyanet Prayer Times via ezanvakti.emushaf.net
- **PWA**: Service Worker + manifest.json with offline caching
- **Storage**: LocalStorage for preferences (city, theme)

## User Personas
1. **Primary**: Turkish Muslims seeking accurate prayer/iftar times
2. **Secondary**: Ramadan observers needing countdown features

## Core Requirements (Static)
- [x] Live Iftar countdown (hours:minutes:seconds)
- [x] 6 prayer times grid (İmsak, Güneş, Öğle, İkindi, Akşam, Yatsı)
- [x] City selection dropdown (18 Turkish cities with Diyanet IDs)
- [x] Dark/Light theme toggle (dark default)
- [x] Ramadan İmsakiyesi modal (correct Hijri dates)
- [x] Ramadan progress bar (from API Hijri data)
- [x] PWA with offline support (caches Diyanet API)
- [x] URL parameter city support (?city=ankara)
- [x] LocalStorage persistence
- [x] Mobile-first responsive design

## What's Been Implemented

### Version 1.0 (Feb 19, 2026)
- Initial build with Aladhan API

### Version 2.0 (Feb 19, 2026) - Current
**API Migration:**
- Switched from Aladhan to Diyanet (emushaf.net)
- Official Turkish Religious Affairs prayer times
- Proper Turkish character support (İ, Ş, Ç, Ğ, Ü, Ö)

**Bug Fixes:**
- Fixed city change bug - countdown now updates immediately
- Proper interval management with useRef (no memory leaks)
- Single countdown interval at any time

**Theme Updates:**
- Dark mode is now default (ignores system preference)
- User preference saved to localStorage
- Smooth 500ms theme transitions

**Ramadan Calendar Fix:**
- Uses Hijri calendar from API response
- Shows actual Ramadan days (not hardcoded)
- Day number column in modal
- Correct 29/30 day duration from data

## Prioritized Backlog
### P0 (Critical) - DONE
- All core features implemented

### P1 (Should Have)
- [ ] Prayer notification reminders
- [ ] Sahur (pre-dawn meal) countdown

### P2 (Nice to Have)
- [ ] Widget for home screens
- [ ] Multiple language support
- [ ] Custom city coordinates input

## Technical Notes
- Diyanet API: `https://ezanvakti.emushaf.net/vakitler/{ilceId}`
- Returns 30-32 days of prayer times
- Hijri dates in `HicriTarihUzun` field (e.g., "5 Ramazan 1447")
- Rate limit: 30 requests/5 min, 200/day

## Next Tasks
1. User testing and feedback collection
2. Consider ad placement for monetization
3. SEO optimization for Turkish keywords
4. Submit to app stores (Trusted Web Activity)
