# İftar Vakti - Prayer Times App PRD

## Original Problem Statement
Build a modern, minimal, high-performance single-page web application that displays daily prayer times with primary focus on Iftar time and a live countdown. Turkish language interface.

## User Choices
- **API**: Diyanet İşleri Başkanlığı (emushaf.net)
- **Theme**: Light mint green - Dark mode default
- **Language**: Turkish only
- **Default City**: Erzincan, Turkey
- **Developer Credit**: Seyrani Kenger

## Architecture
- **Frontend**: React + Tailwind CSS + Shadcn/UI
- **API**: Diyanet Prayer Times via ezanvakti.emushaf.net
- **PWA**: Service Worker + manifest.json
- **Storage**: LocalStorage for preferences

## What's Been Implemented

### Version 3.0 (Feb 19, 2026) - Current

**Ramadan Calendar Fix:**
- Shows all 29 days (Feb 19 - Mar 19, 2026)
- Uses generateRamadanDates() for complete date range
- Days not yet in API show "--:--" placeholder
- Correct day numbering (1-29)

**Ad Container Added:**
- Full-width container below Ramadan progress bar
- 250px height, responsive, centered
- Loads `./reklam.png` from same directory as index.html
- Graceful fallback if image doesn't exist

**Footer Attribution:**
- "Namaz vakitleri T.C. Diyanet İşleri Başkanlığı verilerine dayanmaktadır."
- "This site was developed by Seyrani Kenger."

### Previous Features (Preserved)
- Live Iftar countdown (updates every second)
- 6 prayer times grid
- City selector (18 Turkish cities)
- Dark/Light theme toggle (dark default)
- PWA with offline support
- URL parameter & localStorage persistence

## Ramadan 2026 Dates (Official)
- Start: February 19, 2026 (1 Ramazan 1447)
- End: March 19, 2026 (29 Ramazan 1447)
- Eid: March 20, 2026
- Duration: 29 days

## Ad Deployment Instructions
To enable advertisement:
1. Create image file named `reklam.png`
2. Upload to same directory as index.html on hosting
3. Recommended size: 728x250 or similar leaderboard format
4. Image will automatically appear in ad container

## Next Tasks
1. Add actual reklam.png image for monetization
2. Configure Google AdSense as alternative
3. SEO optimization for Turkish keywords
