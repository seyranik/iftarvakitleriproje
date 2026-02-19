# İftar Vakti - Prayer Times App PRD

## Original Problem Statement
Build a modern, minimal, high-performance single-page web application that displays daily prayer times with primary focus on Iftar time and a live countdown. Turkish language interface.

## User Choices
- **API**: Aladhan API (free, reliable)
- **Theme**: Light mint green (soft, calm, modern)
- **Features**: Minimal - no prayer sounds, no Qibla compass
- **Icons**: Placeholder PWA icons (mosque/crescent design)
- **Language**: Turkish only
- **Default City**: Erzincan, Turkey

## Architecture
- **Frontend**: React + Tailwind CSS + Shadcn/UI
- **API**: Aladhan Prayer Times API (https://api.aladhan.com)
- **PWA**: Service Worker + manifest.json
- **Storage**: LocalStorage for preferences

## User Personas
1. **Primary**: Turkish Muslims seeking accurate prayer/iftar times
2. **Secondary**: Ramadan observers needing countdown features

## Core Requirements (Static)
- [x] Live Iftar countdown (hours:minutes:seconds)
- [x] 6 prayer times grid (İmsak, Güneş, Öğle, İkindi, Akşam, Yatsı)
- [x] City selection dropdown (18 Turkish cities)
- [x] Geolocation detection
- [x] Dark/Light theme toggle
- [x] 30-day schedule modal
- [x] Ramadan progress bar
- [x] PWA with offline support
- [x] URL parameter city support (?city=ankara)
- [x] LocalStorage persistence
- [x] Mobile-first responsive design

## What's Been Implemented (Feb 19, 2026)
- Full Turkish prayer times app
- Aladhan API integration
- Live countdown timer (updates every second)
- All 6 prayer times with icons and highlighting
- City selector with 18 Turkish cities
- Dark/Light mode toggle with system preference detection
- 30-day monthly schedule modal
- Ramadan progress bar (dynamic calculation)
- PWA: manifest.json, service-worker.js, PNG icons
- Proper SEO meta tags and OpenGraph
- WCAG accessibility compliant

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

## Next Tasks
1. User testing and feedback collection
2. Consider ad placement for monetization
3. SEO optimization for Turkish keywords
4. Submit to app stores (Trusted Web Activity)
