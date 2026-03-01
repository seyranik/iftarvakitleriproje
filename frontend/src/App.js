import { useState, useEffect, useCallback, useRef } from "react";
import "@/App.css";
import { Sun, Moon, Sunrise, CloudSun, Sunset, Calendar, MapPin, Bell, BellOff, Volume2, VolumeX, Settings, X, Star, BookOpen, Navigation, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

// ============================================
// DIYANET API CONFIGURATION
// ============================================
const API_BASE = "https://ezanvakti.emushaf.net";
const ALADHAN_API = "https://api.aladhan.com/v1";

// ============================================
// CONSTANTS
// ============================================
const DEFAULT_CITY = "Erzincan";

// ============================================
// TURKISH CITIES WITH DIYANET IDS (All 81 Provinces)
// ============================================
const TURKISH_CITIES = [
  { name: "Adana", ilceId: "9146", lat: 37.0, lng: 35.3 },
  { name: "Adıyaman", ilceId: "9158", lat: 37.8, lng: 38.3 },
  { name: "Afyonkarahisar", ilceId: "9167", lat: 38.7, lng: 30.5 },
  { name: "Ağrı", ilceId: "9185", lat: 39.7, lng: 43.1 },
  { name: "Aksaray", ilceId: "9193", lat: 38.4, lng: 34.0 },
  { name: "Amasya", ilceId: "9198", lat: 40.7, lng: 35.8 },
  { name: "Ankara", ilceId: "9206", lat: 39.9, lng: 32.9 },
  { name: "Antalya", ilceId: "9225", lat: 36.9, lng: 30.7 },
  { name: "Ardahan", ilceId: "9238", lat: 41.1, lng: 42.7 },
  { name: "Artvin", ilceId: "9246", lat: 41.2, lng: 41.8 },
  { name: "Aydın", ilceId: "9252", lat: 37.8, lng: 27.8 },
  { name: "Balıkesir", ilceId: "9270", lat: 39.6, lng: 27.9 },
  { name: "Bartın", ilceId: "9285", lat: 41.6, lng: 32.3 },
  { name: "Batman", ilceId: "9288", lat: 37.9, lng: 41.1 },
  { name: "Bayburt", ilceId: "9295", lat: 40.3, lng: 40.2 },
  { name: "Bilecik", ilceId: "9297", lat: 40.1, lng: 30.0 },
  { name: "Bingöl", ilceId: "9303", lat: 39.1, lng: 40.5 },
  { name: "Bitlis", ilceId: "9311", lat: 38.4, lng: 42.1 },
  { name: "Bolu", ilceId: "9319", lat: 40.7, lng: 31.6 },
  { name: "Burdur", ilceId: "9327", lat: 37.7, lng: 30.3 },
  { name: "Bursa", ilceId: "9335", lat: 40.2, lng: 29.0 },
  { name: "Çanakkale", ilceId: "9352", lat: 40.2, lng: 26.4 },
  { name: "Çankırı", ilceId: "9359", lat: 40.6, lng: 33.6 },
  { name: "Çorum", ilceId: "9371", lat: 40.5, lng: 34.9 },
  { name: "Denizli", ilceId: "9376", lat: 37.8, lng: 29.1 },
  { name: "Diyarbakır", ilceId: "9381", lat: 37.9, lng: 40.2 },
  { name: "Düzce", ilceId: "9392", lat: 40.8, lng: 31.2 },
  { name: "Edirne", ilceId: "9398", lat: 41.7, lng: 26.6 },
  { name: "Elazığ", ilceId: "9407", lat: 38.7, lng: 39.2 },
  { name: "Erzincan", ilceId: "9440", lat: 39.8, lng: 39.5 },
  { name: "Erzurum", ilceId: "9450", lat: 39.9, lng: 41.3 },
  { name: "Eskişehir", ilceId: "9470", lat: 39.8, lng: 30.5 },
  { name: "Gaziantep", ilceId: "9479", lat: 37.1, lng: 37.4 },
  { name: "Giresun", ilceId: "9494", lat: 40.9, lng: 38.4 },
  { name: "Gümüşhane", ilceId: "9501", lat: 40.5, lng: 39.5 },
  { name: "Hakkari", ilceId: "9504", lat: 37.6, lng: 43.7 },
  { name: "Hatay", ilceId: "9515", lat: 36.2, lng: 36.2 },
  { name: "Iğdır", ilceId: "9528", lat: 39.9, lng: 44.0 },
  { name: "Isparta", ilceId: "9535", lat: 37.8, lng: 30.6 },
  { name: "İstanbul", ilceId: "9541", lat: 41.0, lng: 28.9 },
  { name: "İzmir", ilceId: "9560", lat: 38.4, lng: 27.1 },
  { name: "Kahramanmaraş", ilceId: "9577", lat: 37.6, lng: 36.9 },
  { name: "Karabük", ilceId: "9584", lat: 41.2, lng: 32.6 },
  { name: "Karaman", ilceId: "9592", lat: 37.2, lng: 33.2 },
  { name: "Kars", ilceId: "9601", lat: 40.6, lng: 43.1 },
  { name: "Kastamonu", ilceId: "9609", lat: 41.4, lng: 33.8 },
  { name: "Kayseri", ilceId: "9620", lat: 38.7, lng: 35.5 },
  { name: "Kırıkkale", ilceId: "9629", lat: 39.8, lng: 33.5 },
  { name: "Kırklareli", ilceId: "9638", lat: 41.7, lng: 27.2 },
  { name: "Kırşehir", ilceId: "9646", lat: 39.1, lng: 34.2 },
  { name: "Kilis", ilceId: "9651", lat: 36.7, lng: 37.1 },
  { name: "Kocaeli", ilceId: "9654", lat: 40.9, lng: 29.9 },
  { name: "Konya", ilceId: "9676", lat: 37.9, lng: 32.5 },
  { name: "Kütahya", ilceId: "9689", lat: 39.4, lng: 29.9 },
  { name: "Malatya", ilceId: "9703", lat: 38.4, lng: 38.3 },
  { name: "Manisa", ilceId: "9716", lat: 38.6, lng: 27.4 },
  { name: "Mardin", ilceId: "9726", lat: 37.3, lng: 40.7 },
  { name: "Mersin", ilceId: "9737", lat: 36.8, lng: 34.6 },
  { name: "Muğla", ilceId: "9747", lat: 37.2, lng: 28.4 },
  { name: "Muş", ilceId: "9755", lat: 38.7, lng: 41.5 },
  { name: "Nevşehir", ilceId: "9760", lat: 38.6, lng: 34.7 },
  { name: "Niğde", ilceId: "9766", lat: 37.9, lng: 34.7 },
  { name: "Ordu", ilceId: "9782", lat: 41.0, lng: 37.9 },
  { name: "Osmaniye", ilceId: "9788", lat: 37.1, lng: 36.2 },
  { name: "Rize", ilceId: "9799", lat: 41.0, lng: 40.5 },
  { name: "Sakarya", ilceId: "9807", lat: 40.7, lng: 30.4 },
  { name: "Samsun", ilceId: "9819", lat: 41.3, lng: 36.3 },
  { name: "Şanlıurfa", ilceId: "9831", lat: 37.2, lng: 38.8 },
  { name: "Siirt", ilceId: "9846", lat: 37.9, lng: 41.9 },
  { name: "Sinop", ilceId: "9854", lat: 42.0, lng: 35.2 },
  { name: "Sivas", ilceId: "9863", lat: 39.7, lng: 37.0 },
  { name: "Şırnak", ilceId: "9875", lat: 37.5, lng: 42.5 },
  { name: "Tekirdağ", ilceId: "9883", lat: 41.0, lng: 27.5 },
  { name: "Tokat", ilceId: "9893", lat: 40.3, lng: 36.6 },
  { name: "Trabzon", ilceId: "9901", lat: 41.0, lng: 39.7 },
  { name: "Tunceli", ilceId: "9914", lat: 39.1, lng: 39.5 },
  { name: "Uşak", ilceId: "9919", lat: 38.7, lng: 29.4 },
  { name: "Van", ilceId: "9929", lat: 38.5, lng: 43.4 },
  { name: "Yalova", ilceId: "9945", lat: 40.7, lng: 29.3 },
  { name: "Yozgat", ilceId: "9951", lat: 39.8, lng: 34.8 },
  { name: "Zonguldak", ilceId: "9955", lat: 41.5, lng: 31.8 }
];

// ============================================
// FRIDAY HADITH COLLECTION (From Diyanet Sources)
// ============================================
const FRIDAY_HADITHS = [
  {
    text: "Günlerin en hayırlısı Cuma günüdür. Âdem o gün yaratılmış, o gün cennete konulmuş ve o gün cennetten çıkarılmıştır.",
    source: "Müslim, Cum'a, 18",
    reference: "Hz. Ebu Hureyre (r.a.)"
  },
  {
    text: "Kim Cuma günü gusül abdesti alır, sonra camiye gider ve kılınan namazı kılar, hutbe bitinceye kadar susarsa, bu onun için iki Cuma arasındaki günahlarına kefaret olur.",
    source: "Buhârî, Cum'a, 6",
    reference: "Hz. Selman-ı Farisî (r.a.)"
  },
  {
    text: "Cuma günü bana çok salavat getirin. Çünkü sizin salavatınız bana arz edilir.",
    source: "Ebû Dâvûd, Salât, 201",
    reference: "Hz. Evs b. Evs (r.a.)"
  },
  {
    text: "Cuma günü öyle bir saat vardır ki, Müslüman bir kul o saatte Allah'tan bir şey isterse, Allah ona mutlaka verir.",
    source: "Buhârî, Cum'a, 37",
    reference: "Hz. Ebu Hureyre (r.a.)"
  },
  {
    text: "Beş vakit namaz, Cuma'dan Cuma'ya, Ramazan'dan Ramazan'a, aralarındaki günahlara kefârettir; büyük günahlardan sakınıldığı takdirde.",
    source: "Müslim, Tahâret, 16",
    reference: "Hz. Ebu Hureyre (r.a.)"
  },
  {
    text: "Kim Kehf sûresini Cuma günü okursa, iki Cuma arasını aydınlatan bir nur ona ihsan edilir.",
    source: "Hâkim, el-Müstedrek",
    reference: "Hz. Ebu Said el-Hudrî (r.a.)"
  },
  {
    text: "Cuma günü melekler mescidin kapısında durur, gelenleri sırasıyla yazarlar. İmam minbere çıkınca defterlerini kapatırlar.",
    source: "Buhârî, Cum'a, 31",
    reference: "Hz. Ebu Hureyre (r.a.)"
  },
  {
    text: "Cuma namazına giden kimse, her adımı için bir yıllık oruç ve bir yıllık gece namazı sevabı yazılır.",
    source: "Tirmizî, Cum'a, 4",
    reference: "Hz. Evs b. Evs (r.a.)"
  }
];

// ============================================
// PRAYER NAMES IN TURKISH
// ============================================
const PRAYER_NAMES = {
  Imsak: "İmsak",
  Gunes: "Güneş",
  Ogle: "Öğle",
  Ikindi: "İkindi",
  Aksam: "Akşam",
  Yatsi: "Yatsı"
};

const PRAYER_ORDER = ["Imsak", "Gunes", "Ogle", "Ikindi", "Aksam", "Yatsi"];
const MAIN_PRAYERS = ["Gunes", "Ogle", "Ikindi", "Aksam", "Yatsi"]; // For countdown (excluding Imsak)

// Prayer icons
const PRAYER_ICONS = {
  Imsak: Sunrise,
  Gunes: Sun,
  Ogle: Sun,
  Ikindi: CloudSun,
  Aksam: Sunset,
  Yatsi: Moon
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

function parseTimeToDate(timeStr, baseDate = new Date()) {
  if (!timeStr) return null;
  const [hours, minutes] = timeStr.split(":").map(Number);
  const date = new Date(baseDate);
  date.setHours(hours, minutes, 0, 0);
  return date;
}

function formatCountdown(ms) {
  if (ms <= 0) return { hours: "00", minutes: "00", seconds: "00", total: 0 };
  const totalSeconds = Math.floor(ms / 1000);
  return {
    hours: String(Math.floor(totalSeconds / 3600)).padStart(2, "0"),
    minutes: String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0"),
    seconds: String(totalSeconds % 60).padStart(2, "0"),
    total: totalSeconds
  };
}

function getTodayString() {
  const t = new Date();
  return `${String(t.getDate()).padStart(2, "0")}.${String(t.getMonth() + 1).padStart(2, "0")}.${t.getFullYear()}`;
}

function isFriday() {
  return new Date().getDay() === 5;
}

function getDayOfWeekTurkish() {
  const days = ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"];
  return days[new Date().getDay()];
}

function getRandomHadith() {
  const today = new Date();
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  const index = seed % FRIDAY_HADITHS.length;
  return FRIDAY_HADITHS[index];
}

// ============================================
// RAMADAN DETECTION
// ============================================

async function fetchRamadanDates() {
  const cacheKey = "ramadan-dates-cache";
  const cached = localStorage.getItem(cacheKey);
  
  if (cached) {
    try {
      const data = JSON.parse(cached);
      if (data.expiry > Date.now()) {
        return data;
      }
    } catch (e) {
      localStorage.removeItem(cacheKey);
    }
  }
  
  try {
    const currentYear = new Date().getFullYear();
    const response = await fetch(`${ALADHAN_API}/hijriCalendar/${currentYear}/9?adjustment=1`);
    const data = await response.json();
    
    if (data.code === 200 && data.data && data.data.length > 0) {
      const firstDay = data.data[0];
      const lastDay = data.data[data.data.length - 1];
      
      const result = {
        currentRamadan: {
          start: firstDay.gregorian.date,
          end: lastDay.gregorian.date,
          year: currentYear
        },
        expiry: Date.now() + (24 * 60 * 60 * 1000) // Cache for 24 hours
      };
      
      localStorage.setItem(cacheKey, JSON.stringify(result));
      return result;
    }
  } catch (e) {
    console.error("Failed to fetch Ramadan dates:", e);
  }
  
  // Fallback: Ramadan 2026 dates
  return {
    currentRamadan: {
      start: "19-02-2026",
      end: "19-03-2026",
      year: 2026
    },
    expiry: Date.now() + (24 * 60 * 60 * 1000)
  };
}

function parseAladhanDate(dateStr) {
  const parts = dateStr.split("-");
  return new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
}

function isDateInRamadan(date, ramadanDates) {
  if (!ramadanDates || !ramadanDates.currentRamadan) return false;
  
  const checkDate = new Date(date);
  checkDate.setHours(0, 0, 0, 0);
  
  const start = parseAladhanDate(ramadanDates.currentRamadan.start);
  start.setHours(0, 0, 0, 0);
  
  const end = parseAladhanDate(ramadanDates.currentRamadan.end);
  end.setHours(23, 59, 59, 999);
  
  return checkDate >= start && checkDate <= end;
}

function getRamadanDayNumber(date, ramadanDates) {
  if (!isDateInRamadan(date, ramadanDates)) return null;
  
  const checkDate = new Date(date);
  checkDate.setHours(0, 0, 0, 0);
  
  const start = parseAladhanDate(ramadanDates.currentRamadan.start);
  start.setHours(0, 0, 0, 0);
  
  return Math.floor((checkDate - start) / (1000 * 60 * 60 * 24)) + 1;
}

// ============================================
// NOTIFICATION SYSTEM
// ============================================

async function requestNotificationPermission() {
  if (!("Notification" in window)) {
    return "unsupported";
  }
  
  if (Notification.permission === "granted") {
    return "granted";
  }
  
  if (Notification.permission !== "denied") {
    const permission = await Notification.requestPermission();
    return permission;
  }
  
  return "denied";
}

function sendNotification(title, body, options = {}) {
  if (Notification.permission !== "granted") return;
  
  const settings = JSON.parse(localStorage.getItem("prayer-settings") || "{}");
  
  const notificationOptions = {
    body,
    icon: "/icons/icon-192.png",
    badge: "/icons/icon-192.png",
    tag: options.tag || "prayer-notification",
    renotify: true,
    ...options
  };
  
  if (settings.silentMode) {
    notificationOptions.silent = true;
  }
  
  if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({
      type: "SHOW_NOTIFICATION",
      title,
      options: notificationOptions
    });
  } else {
    new Notification(title, notificationOptions);
  }
}

// ============================================
// MAIN APP COMPONENT
// ============================================
function App() {
  // State
  const [theme, setTheme] = useState("dark");
  const [city, setCity] = useState(null);
  const [prayerTimes, setPrayerTimes] = useState(null);
  const [monthlyData, setMonthlyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  
  // Ramadan state
  const [ramadanDates, setRamadanDates] = useState(null);
  const [isRamadan, setIsRamadan] = useState(false);
  const [ramadanDay, setRamadanDay] = useState(null);
  const [ramadanProgress, setRamadanProgress] = useState(0);
  
  // Countdown state
  const [countdown, setCountdown] = useState({ hours: "00", minutes: "00", seconds: "00" });
  const [nextPrayer, setNextPrayer] = useState(null);
  const [countdownLabel, setCountdownLabel] = useState("Sonraki Namaza Kalan Süre");
  
  // Settings state
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [silentMode, setSilentMode] = useState(false);
  const [showNotificationPrompt, setShowNotificationPrompt] = useState(false);
  
  // Friday state
  const [todayIsFriday, setTodayIsFriday] = useState(false);
  const [fridayHadith, setFridayHadith] = useState(null);
  
  // Refs
  const countdownIntervalRef = useRef(null);
  const notificationCheckRef = useRef(null);
  const lastNotifiedPrayerRef = useRef(null);

  // ============================================
  // INITIALIZATION
  // ============================================
  
  useEffect(() => {
    // Load theme
    const savedTheme = localStorage.getItem("prayer-theme") || "dark";
    setTheme(savedTheme);
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(savedTheme);
    
    // Load settings
    const settings = JSON.parse(localStorage.getItem("prayer-settings") || "{}");
    setNotificationsEnabled(settings.notificationsEnabled || false);
    setSilentMode(settings.silentMode || false);
    
    // Check if notification prompt was shown
    const promptShown = localStorage.getItem("notification-prompt-shown");
    if (!promptShown && "Notification" in window) {
      setShowNotificationPrompt(true);
    }
    
    // Check Friday
    setTodayIsFriday(isFriday());
    if (isFriday()) {
      setFridayHadith(getRandomHadith());
    }
    
    // Fetch Ramadan dates
    fetchRamadanDates().then(dates => {
      setRamadanDates(dates);
      const inRamadan = isDateInRamadan(new Date(), dates);
      setIsRamadan(inRamadan);
      if (inRamadan) {
        const day = getRamadanDayNumber(new Date(), dates);
        setRamadanDay(day);
        setRamadanProgress((day / 29) * 100);
      }
    });
    
    // Register service worker
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/service-worker.js").catch(e => {
        console.log("SW registration failed:", e);
      });
    }
  }, []);

  // ============================================
  // THEME
  // ============================================
  
  useEffect(() => {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
    localStorage.setItem("prayer-theme", theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === "light" ? "dark" : "light");
  }, []);

  // ============================================
  // CITY MANAGEMENT
  // ============================================
  
  useEffect(() => {
    const savedCity = localStorage.getItem("prayer-city");
    if (savedCity) {
      try {
        const c = JSON.parse(savedCity);
        if (c.ilceId) {
          setCity(c);
          return;
        }
      } catch (e) {}
    }
    setCity(TURKISH_CITIES.find(c => c.name === "Erzincan") || TURKISH_CITIES[0]);
  }, []);

  const handleCityChange = useCallback((cityName) => {
    const newCity = TURKISH_CITIES.find(c => c.name === cityName);
    if (newCity) {
      setPrayerTimes(null);
      setMonthlyData([]);
      setCity(newCity);
      localStorage.setItem("prayer-city", JSON.stringify(newCity));
    }
  }, []);

  // ============================================
  // FETCH PRAYER TIMES
  // ============================================
  
  const fetchPrayerTimes = useCallback(async (selectedCity) => {
    if (!selectedCity) return;
    setLoading(true);
    
    try {
      const cacheKey = `diyanet-${selectedCity.ilceId}-${new Date().toDateString()}`;
      const cached = localStorage.getItem(cacheKey);
      
      if (cached) {
        const data = JSON.parse(cached);
        processApiData(data);
        setLoading(false);
        return;
      }
      
      const response = await fetch(`${API_BASE}/vakitler/${selectedCity.ilceId}`);
      if (!response.ok) throw new Error("API error");
      
      const data = await response.json();
      if (!data || !data.length) throw new Error("No data");
      
      localStorage.setItem(cacheKey, JSON.stringify(data));
      processApiData(data);
    } catch (e) {
      console.error("Fetch error:", e);
      toast.error("Namaz vakitleri alınamadı");
    } finally {
      setLoading(false);
    }
  }, []);

  const processApiData = useCallback((data) => {
    setMonthlyData(data);
    
    const todayStr = getTodayString();
    const todayData = data.find(d => d.MiladiTarihKisa === todayStr) || data[0];
    
    setPrayerTimes({
      Imsak: todayData.Imsak,
      Gunes: todayData.Gunes,
      Ogle: todayData.Ogle,
      Ikindi: todayData.Ikindi,
      Aksam: todayData.Aksam,
      Yatsi: todayData.Yatsi
    });
  }, []);

  useEffect(() => {
    if (city) {
      fetchPrayerTimes(city);
    }
  }, [city, fetchPrayerTimes]);

  // ============================================
  // COUNTDOWN LOGIC
  // ============================================
  
  useEffect(() => {
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
    }
    
    if (!prayerTimes) return;
    
    const updateCountdown = () => {
      const now = new Date();
      let targetPrayer = null;
      let targetTime = null;
      let minDiff = Infinity;
      
      // Find next prayer
      for (const prayer of MAIN_PRAYERS) {
        const prayerTime = parseTimeToDate(prayerTimes[prayer]);
        if (!prayerTime) continue;
        
        const diff = prayerTime - now;
        if (diff > 0 && diff < minDiff) {
          minDiff = diff;
          targetPrayer = prayer;
          targetTime = prayerTime;
        }
      }
      
      // If no prayer left today, get first prayer of tomorrow
      if (!targetPrayer) {
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowStr = `${String(tomorrow.getDate()).padStart(2, "0")}.${String(tomorrow.getMonth() + 1).padStart(2, "0")}.${tomorrow.getFullYear()}`;
        const tomorrowData = monthlyData.find(d => d.MiladiTarihKisa === tomorrowStr);
        
        if (tomorrowData) {
          targetPrayer = "Gunes"; // First prayer after Imsak
          targetTime = parseTimeToDate(tomorrowData.Gunes, tomorrow);
          minDiff = targetTime - now;
        }
      }
      
      if (targetPrayer && targetTime) {
        setNextPrayer(targetPrayer);
        setCountdown(formatCountdown(minDiff));
        
        // Set countdown label based on Ramadan and prayer
        if (isRamadan && targetPrayer === "Aksam") {
          setCountdownLabel("İftar'a Kalan Süre");
        } else {
          setCountdownLabel(`${PRAYER_NAMES[targetPrayer]} Namazına Kalan Süre`);
        }
      }
    };
    
    updateCountdown();
    countdownIntervalRef.current = setInterval(updateCountdown, 1000);
    
    return () => {
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
    };
  }, [prayerTimes, monthlyData, isRamadan]);

  // ============================================
  // NOTIFICATION SCHEDULING
  // ============================================
  
  useEffect(() => {
    if (!notificationsEnabled || !prayerTimes) return;
    
    if (notificationCheckRef.current) {
      clearInterval(notificationCheckRef.current);
    }
    
    const checkNotifications = () => {
      const now = new Date();
      const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
      
      // Check each prayer time
      for (const prayer of PRAYER_ORDER) {
        if (prayerTimes[prayer] === currentTime && lastNotifiedPrayerRef.current !== `${prayer}-${currentTime}`) {
          lastNotifiedPrayerRef.current = `${prayer}-${currentTime}`;
          
          let title = `${PRAYER_NAMES[prayer]} Vakti`;
          let body = `${PRAYER_NAMES[prayer]} namazı vakti girdi.`;
          
          if (isRamadan && prayer === "Aksam") {
            title = "İftar Vakti";
            body = "İftar vakti girdi. Hayırlı iftarlar!";
          } else if (isRamadan && prayer === "Imsak") {
            title = "İmsak Vakti";
            body = "Sahur vakti sona erdi. Hayırlı oruçlar!";
          }
          
          sendNotification(title, body, { tag: `prayer-${prayer}` });
        }
      }
      
      // Friday notification - 1 hour before Dhuhr
      if (isFriday() && prayerTimes.Ogle) {
        const ogleTime = parseTimeToDate(prayerTimes.Ogle);
        const oneHourBefore = new Date(ogleTime.getTime() - 60 * 60 * 1000);
        const reminderTime = `${String(oneHourBefore.getHours()).padStart(2, "0")}:${String(oneHourBefore.getMinutes()).padStart(2, "0")}`;
        
        if (currentTime === reminderTime && lastNotifiedPrayerRef.current !== `friday-${reminderTime}`) {
          lastNotifiedPrayerRef.current = `friday-${reminderTime}`;
          const hadith = getRandomHadith();
          sendNotification(
            "Cuma Günü Hatırlatması",
            `Bugün Cuma günü. Cuma namazına hazırlanın.\n\n"${hadith.text.substring(0, 100)}..."`,
            { tag: "friday-reminder" }
          );
        }
      }
    };
    
    checkNotifications();
    notificationCheckRef.current = setInterval(checkNotifications, 30000); // Check every 30 seconds
    
    return () => {
      if (notificationCheckRef.current) {
        clearInterval(notificationCheckRef.current);
      }
    };
  }, [notificationsEnabled, prayerTimes, isRamadan]);

  // ============================================
  // SETTINGS HANDLERS
  // ============================================
  
  const handleNotificationToggle = async (enabled) => {
    if (enabled) {
      const permission = await requestNotificationPermission();
      if (permission === "granted") {
        setNotificationsEnabled(true);
        const settings = JSON.parse(localStorage.getItem("prayer-settings") || "{}");
        settings.notificationsEnabled = true;
        localStorage.setItem("prayer-settings", JSON.stringify(settings));
        toast.success("Bildirimler etkinleştirildi");
      } else {
        toast.error("Bildirim izni verilmedi");
      }
    } else {
      setNotificationsEnabled(false);
      const settings = JSON.parse(localStorage.getItem("prayer-settings") || "{}");
      settings.notificationsEnabled = false;
      localStorage.setItem("prayer-settings", JSON.stringify(settings));
      toast.info("Bildirimler devre dışı bırakıldı");
    }
  };

  const handleSilentModeToggle = (enabled) => {
    setSilentMode(enabled);
    const settings = JSON.parse(localStorage.getItem("prayer-settings") || "{}");
    settings.silentMode = enabled;
    localStorage.setItem("prayer-settings", JSON.stringify(settings));
    toast.info(enabled ? "Sessiz mod etkinleştirildi" : "Sessiz mod devre dışı");
  };

  const handleNotificationPrompt = async (accept) => {
    localStorage.setItem("notification-prompt-shown", "true");
    setShowNotificationPrompt(false);
    
    if (accept) {
      await handleNotificationToggle(true);
    }
  };

  // ============================================
  // DATE CHANGE CHECK
  // ============================================
  
  useEffect(() => {
    let lastDate = new Date().toDateString();
    
    const checkDateChange = () => {
      const currentDate = new Date().toDateString();
      if (currentDate !== lastDate) {
        lastDate = currentDate;
        
        // Refresh data
        if (city) fetchPrayerTimes(city);
        
        // Update Friday status
        setTodayIsFriday(isFriday());
        if (isFriday()) {
          setFridayHadith(getRandomHadith());
        } else {
          setFridayHadith(null);
        }
        
        // Update Ramadan status
        if (ramadanDates) {
          const inRamadan = isDateInRamadan(new Date(), ramadanDates);
          setIsRamadan(inRamadan);
          if (inRamadan) {
            const day = getRamadanDayNumber(new Date(), ramadanDates);
            setRamadanDay(day);
            setRamadanProgress((day / 29) * 100);
          }
        }
        
        // Reset notification tracker
        lastNotifiedPrayerRef.current = null;
      }
    };
    
    const interval = setInterval(checkDateChange, 60000);
    return () => clearInterval(interval);
  }, [city, fetchPrayerTimes, ramadanDates]);

  // ============================================
  // RENDER
  // ============================================
  
  return (
    <div className="min-h-screen bg-background transition-colors duration-500" data-testid="prayer-app">
      <Toaster position="top-center" richColors />
      
      {/* Notification Permission Prompt */}
      {showNotificationPrompt && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl p-6 max-w-md w-full shadow-xl animate-fade-in-up">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <Bell className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-xl font-medium">Bildirim İzni</h2>
            </div>
            <p className="text-muted-foreground mb-6">
              Namaz vakitlerinde bildirim almak ister misiniz? Vakitler girdiğinde size hatırlatma yapılacaktır.
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => handleNotificationPrompt(false)}
              >
                Hayır, teşekkürler
              </Button>
              <Button
                className="flex-1"
                onClick={() => handleNotificationPrompt(true)}
              >
                Evet, etkinleştir
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {/* Ramadan Progress Bar */}
      {isRamadan && (
        <div className="fixed top-0 left-0 right-0 z-50" data-testid="ramadan-progress">
          <Progress value={ramadanProgress} className="h-1 rounded-none" />
          <div className="bg-primary/10 backdrop-blur-sm py-2 px-4 text-center">
            <span className="text-sm font-medium text-primary">
              Ramazan'ın {ramadanDay}. günü — %{Math.round(ramadanProgress)}
            </span>
          </div>
        </div>
      )}
      
      <div className={`container mx-auto px-4 md:px-8 py-8 max-w-5xl ${isRamadan ? "pt-16" : ""}`}>
        {/* Header */}
        <header className="flex items-center justify-between mb-8 animate-fade-in-up">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary opacity-70" />
            <Select value={city?.name || ""} onValueChange={handleCityChange}>
              <SelectTrigger className="bg-transparent border-none text-xl md:text-2xl font-light hover:bg-transparent hover:text-primary focus:ring-0 focus:ring-offset-0 px-0 shadow-none gap-2 w-auto">
                <SelectValue placeholder="Şehir seçin" />
              </SelectTrigger>
              <SelectContent>
                {TURKISH_CITIES.map(c => (
                  <SelectItem key={c.name} value={c.name}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSettingsOpen(true)}
              className="rounded-full"
              data-testid="settings-button"
            >
              <Settings className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full"
              data-testid="theme-toggle"
            >
              {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </Button>
          </div>
        </header>
        
        {/* Date and Day Info */}
        <div className="text-center mb-6 animate-fade-in-up">
          <p className="text-muted-foreground text-sm">
            {new Date().toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })} • {getDayOfWeekTurkish()}
          </p>
        </div>
        
        {/* Countdown Section */}
        <section className="flex flex-col items-center justify-center min-h-[35vh] mb-8 animate-fade-in-up animation-delay-100" data-testid="countdown-section">
          {loading ? (
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
              <p className="text-muted-foreground">Yükleniyor...</p>
            </div>
          ) : (
            <>
              <p className="text-xs uppercase tracking-[0.2em] font-bold text-muted-foreground mb-4">
                {countdownLabel}
              </p>
              
              <div className="flex items-center gap-2 md:gap-4 mb-6">
                <div className="flex flex-col items-center">
                  <span className="text-6xl md:text-8xl font-extralight tracking-tighter tabular-nums">{countdown.hours}</span>
                  <span className="text-xs uppercase tracking-wider text-muted-foreground mt-2">Saat</span>
                </div>
                <span className="text-4xl md:text-6xl font-extralight text-primary/50 -mt-6">:</span>
                <div className="flex flex-col items-center">
                  <span className="text-6xl md:text-8xl font-extralight tracking-tighter tabular-nums">{countdown.minutes}</span>
                  <span className="text-xs uppercase tracking-wider text-muted-foreground mt-2">Dakika</span>
                </div>
                <span className="text-4xl md:text-6xl font-extralight text-primary/50 -mt-6">:</span>
                <div className="flex flex-col items-center">
                  <span className="text-6xl md:text-8xl font-extralight tracking-tighter tabular-nums">{countdown.seconds}</span>
                  <span className="text-xs uppercase tracking-wider text-muted-foreground mt-2">Saniye</span>
                </div>
              </div>
              
              {nextPrayer && prayerTimes && (
                <div className="text-center">
                  <p className="text-muted-foreground text-sm mb-1">
                    {isRamadan && nextPrayer === "Aksam" ? "İftar Vakti" : `${PRAYER_NAMES[nextPrayer]} Vakti`}
                  </p>
                  <p className="text-3xl md:text-4xl font-light text-primary">{prayerTimes[nextPrayer]}</p>
                </div>
              )}
            </>
          )}
        </section>
        
        {/* Friday Hadith Section */}
        {todayIsFriday && fridayHadith && (
          <section className="mb-8 animate-fade-in-up animation-delay-150" data-testid="friday-section">
            <div className="bg-gradient-to-br from-emerald-900/30 to-teal-900/30 border border-emerald-500/30 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <Star className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="font-medium text-emerald-400">Cuma Günü</h3>
                  <p className="text-xs text-muted-foreground">Haftanın En Hayırlı Günü</p>
                </div>
              </div>
              
              <div className="bg-background/30 rounded-xl p-4 mb-4">
                <BookOpen className="w-5 h-5 text-emerald-400 mb-2" />
                <p className="text-sm leading-relaxed text-foreground/90 italic">
                  "{fridayHadith.text}"
                </p>
              </div>
              
              <div className="text-xs text-muted-foreground">
                <p className="font-medium">{fridayHadith.reference}</p>
                <p>{fridayHadith.source}</p>
              </div>
            </div>
          </section>
        )}
        
        {/* Prayer Times Grid */}
        {prayerTimes && (
          <section className="mb-8 animate-fade-in-up animation-delay-200" data-testid="prayer-times-grid">
            <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
              {PRAYER_ORDER.map((prayer, index) => {
                const Icon = PRAYER_ICONS[prayer];
                const isNext = prayer === nextPrayer;
                const isIftar = isRamadan && prayer === "Aksam";
                
                return (
                  <div
                    key={prayer}
                    className={`prayer-card flex flex-col items-center justify-center p-5 rounded-2xl bg-card border transition-all duration-300 ${
                      isNext || isIftar
                        ? "ring-2 ring-primary bg-primary/5 border-primary shadow-lg"
                        : "border-border/50 hover:border-primary/30"
                    }`}
                    style={{ animationDelay: `${index * 50}ms` }}
                    data-testid={`prayer-card-${prayer.toLowerCase()}`}
                  >
                    <Icon className={`w-6 h-6 mb-3 ${isNext || isIftar ? "text-primary" : "text-muted-foreground"}`} strokeWidth={1.5} />
                    <span className="text-xs uppercase tracking-[0.1em] font-bold text-muted-foreground mb-2">
                      {PRAYER_NAMES[prayer]}
                    </span>
                    <span className={`text-xl font-light tabular-nums ${isNext || isIftar ? "text-primary" : "text-foreground"}`}>
                      {prayerTimes[prayer]}
                    </span>
                  </div>
                );
              })}
            </div>
          </section>
        )}
        
        {/* Schedule Button */}
        <section className="flex justify-center mb-8 animate-fade-in-up animation-delay-300">
          <Dialog open={scheduleOpen} onOpenChange={setScheduleOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2 rounded-full px-6 py-5 text-base hover:bg-primary hover:text-primary-foreground transition-all">
                <Calendar className="w-5 h-5" />
                {isRamadan ? "Ramazan İmsakiyesi" : "Aylık Takvim"}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[80vh] p-0 overflow-hidden">
              <DialogHeader className="p-6 pb-0">
                <DialogTitle className="text-2xl font-light flex items-center gap-2">
                  <Calendar className="w-6 h-6 text-primary" />
                  {city?.name} — {isRamadan ? "Ramazan İmsakiyesi" : "Aylık Namaz Vakitleri"}
                </DialogTitle>
                <DialogDescription className="text-sm text-muted-foreground mt-1">
                  {city?.name} için namaz vakitleri
                </DialogDescription>
              </DialogHeader>
              <div className="h-[60vh] overflow-y-auto overflow-x-auto px-4 md:px-6 pb-6">
                <div className="min-w-[600px]">
                  <table className="w-full text-sm">
                    <thead className="sticky top-0 bg-background z-10">
                      <tr className="border-b">
                        <th className="text-left py-3 px-2 font-medium text-muted-foreground">Tarih</th>
                        <th className="text-center py-3 px-2 font-medium text-muted-foreground">İmsak</th>
                        <th className="text-center py-3 px-2 font-medium text-muted-foreground">Güneş</th>
                        <th className="text-center py-3 px-2 font-medium text-muted-foreground">Öğle</th>
                        <th className="text-center py-3 px-2 font-medium text-muted-foreground">İkindi</th>
                        <th className="text-center py-3 px-2 font-medium text-primary font-bold">Akşam</th>
                        <th className="text-center py-3 px-2 font-medium text-muted-foreground">Yatsı</th>
                      </tr>
                    </thead>
                    <tbody>
                      {monthlyData.map((day, index) => {
                        const todayStr = getTodayString();
                        const isToday = day.MiladiTarihKisa === todayStr;
                        
                        return (
                          <tr key={index} className={`border-b transition-colors ${isToday ? "bg-primary/10" : "hover:bg-muted/50"}`}>
                            <td className="py-3 px-2 font-medium whitespace-nowrap">{day.MiladiTarihKisa}</td>
                            <td className="text-center py-3 px-2 tabular-nums">{day.Imsak}</td>
                            <td className="text-center py-3 px-2 tabular-nums">{day.Gunes}</td>
                            <td className="text-center py-3 px-2 tabular-nums">{day.Ogle}</td>
                            <td className="text-center py-3 px-2 tabular-nums">{day.Ikindi}</td>
                            <td className="text-center py-3 px-2 tabular-nums font-medium text-primary">{day.Aksam}</td>
                            <td className="text-center py-3 px-2 tabular-nums">{day.Yatsi}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </section>
        
        {/* Footer */}
        <footer className="text-center text-sm text-muted-foreground animate-fade-in-up animation-delay-400 space-y-2">
          <p>Namaz vakitleri T.C. Diyanet İşleri Başkanlığı verilerine dayanmaktadır.</p>
          <p className="text-xs opacity-70">Developed by Seyrani Kenger</p>
        </footer>
      </div>
      
      {/* Settings Dialog */}
      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-primary" />
              Ayarlar
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            {/* Notifications Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {notificationsEnabled ? (
                  <Bell className="w-5 h-5 text-primary" />
                ) : (
                  <BellOff className="w-5 h-5 text-muted-foreground" />
                )}
                <div>
                  <p className="font-medium">Bildirimler</p>
                  <p className="text-xs text-muted-foreground">Namaz vakitlerinde bildirim al</p>
                </div>
              </div>
              <Switch
                checked={notificationsEnabled}
                onCheckedChange={handleNotificationToggle}
              />
            </div>
            
            {/* Silent Mode Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {silentMode ? (
                  <VolumeX className="w-5 h-5 text-muted-foreground" />
                ) : (
                  <Volume2 className="w-5 h-5 text-primary" />
                )}
                <div>
                  <p className="font-medium">Sessiz Mod</p>
                  <p className="text-xs text-muted-foreground">Bildirimler sessiz olsun</p>
                </div>
              </div>
              <Switch
                checked={silentMode}
                onCheckedChange={handleSilentModeToggle}
                disabled={!notificationsEnabled}
              />
            </div>
            
            {/* Info */}
            <div className="pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground text-center">
                Hesaplama Metodu: Diyanet İşleri Başkanlığı (Türkiye)
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default App;
