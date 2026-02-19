import { useState, useEffect, useCallback, useRef } from "react";
import "@/App.css";
import { Sun, Moon, Sunrise, CloudSun, Sunset, Calendar, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

// ============================================
// DIYANET API CONFIGURATION (emushaf.net)
// ============================================
const API_BASE = "https://ezanvakti.emushaf.net";

// Turkish cities with Diyanet API IDs (şehir ID + ilçe ID for merkez)
const TURKISH_CITIES = [
  { name: "Adana", displayName: "ADANA", sehirId: "500", ilceId: "9146" },
  { name: "Ankara", displayName: "ANKARA", sehirId: "506", ilceId: "9206" },
  { name: "Antalya", displayName: "ANTALYA", sehirId: "507", ilceId: "9225" },
  { name: "Bursa", displayName: "BURSA", sehirId: "520", ilceId: "9335" },
  { name: "Diyarbakır", displayName: "DİYARBAKIR", sehirId: "525", ilceId: "9381" },
  { name: "Erzincan", displayName: "ERZİNCAN", sehirId: "529", ilceId: "9440" },
  { name: "Erzurum", displayName: "ERZURUM", sehirId: "530", ilceId: "9450" },
  { name: "Eskişehir", displayName: "ESKİŞEHİR", sehirId: "531", ilceId: "9470" },
  { name: "Gaziantep", displayName: "GAZİANTEP", sehirId: "532", ilceId: "9479" },
  { name: "İstanbul", displayName: "İSTANBUL", sehirId: "539", ilceId: "9541" },
  { name: "İzmir", displayName: "İZMİR", sehirId: "540", ilceId: "9560" },
  { name: "Kayseri", displayName: "KAYSERİ", sehirId: "546", ilceId: "9620" },
  { name: "Konya", displayName: "KONYA", sehirId: "552", ilceId: "9676" },
  { name: "Malatya", displayName: "MALATYA", sehirId: "554", ilceId: "9703" },
  { name: "Mersin", displayName: "MERSİN", sehirId: "557", ilceId: "9737" },
  { name: "Samsun", displayName: "SAMSUN", sehirId: "566", ilceId: "9819" },
  { name: "Trabzon", displayName: "TRABZON", sehirId: "574", ilceId: "9901" },
  { name: "Van", displayName: "VAN", sehirId: "577", ilceId: "9929" },
];

// Ramadan 2026 dates for Turkey (official)
// Starts: February 19, 2026 (1 Ramazan 1447)
// Ends: March 19, 2026 (29 Ramazan 1447) - Last day of Ramadan
// Eid: March 20, 2026
const RAMADAN_2026 = {
  start: new Date(2026, 1, 19), // Feb 19, 2026
  end: new Date(2026, 2, 19),   // Mar 19, 2026 (last day of Ramadan)
  totalDays: 29 // 29 days for Ramadan 2026
};

// Generate all Ramadan dates
function generateRamadanDates() {
  const dates = [];
  const start = new Date(RAMADAN_2026.start);
  const end = new Date(RAMADAN_2026.end);
  
  let current = new Date(start);
  while (current <= end) {
    dates.push({
      date: new Date(current),
      dateStr: `${current.getDate().toString().padStart(2, "0")}.${(current.getMonth() + 1).toString().padStart(2, "0")}.${current.getFullYear()}`,
      dayNumber: Math.floor((current - start) / (1000 * 60 * 60 * 24)) + 1
    });
    current.setDate(current.getDate() + 1);
  }
  
  return dates;
}

const ALL_RAMADAN_DATES = generateRamadanDates();

// Prayer icons mapping
const PRAYER_ICONS = {
  Imsak: Sunrise,
  Gunes: Sun,
  Ogle: Sun,
  Ikindi: CloudSun,
  Aksam: Sunset,
  Yatsi: Moon
};

// Prayer display names in Turkish
const PRAYER_NAMES = {
  Imsak: "İmsak",
  Gunes: "Güneş",
  Ogle: "Öğle",
  Ikindi: "İkindi",
  Aksam: "Akşam",
  Yatsi: "Yatsı"
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

// Parse time string (HH:MM) to Date object for today
function parseTimeToDate(timeStr) {
  if (!timeStr) return null;
  const [hours, minutes] = timeStr.split(":").map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date;
}

// Format countdown from milliseconds
function formatCountdown(ms) {
  if (ms <= 0) return { hours: "00", minutes: "00", seconds: "00", total: 0 };
  
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  
  return {
    hours: hours.toString().padStart(2, "0"),
    minutes: minutes.toString().padStart(2, "0"),
    seconds: seconds.toString().padStart(2, "0"),
    total: totalSeconds
  };
}

// Check if date is within Ramadan 2026
function isDateInRamadan(date) {
  const checkDate = new Date(date);
  checkDate.setHours(0, 0, 0, 0);
  
  const start = new Date(RAMADAN_2026.start);
  start.setHours(0, 0, 0, 0);
  
  const end = new Date(RAMADAN_2026.end);
  end.setHours(23, 59, 59, 999);
  
  return checkDate >= start && checkDate <= end;
}

// Get Ramadan day number for a given date
function getRamadanDayNumber(date) {
  if (!isDateInRamadan(date)) return null;
  
  const checkDate = new Date(date);
  checkDate.setHours(0, 0, 0, 0);
  
  const start = new Date(RAMADAN_2026.start);
  start.setHours(0, 0, 0, 0);
  
  const diffTime = checkDate - start;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays + 1; // Day 1 = Feb 19
}

// Get Ramadan info for today
function getRamadanInfo() {
  const today = new Date();
  
  if (!isDateInRamadan(today)) {
    return { isRamadan: false };
  }
  
  const dayOfRamadan = getRamadanDayNumber(today);
  const totalDays = RAMADAN_2026.totalDays;
  const progress = (dayOfRamadan / totalDays) * 100;
  
  return {
    isRamadan: true,
    dayOfRamadan,
    totalDays,
    progress
  };
}

// ============================================
// MAIN APP COMPONENT
// ============================================
function App() {
  // State
  const [theme, setTheme] = useState("dark"); // Default to dark
  const [city, setCity] = useState(null);
  const [prayerTimes, setPrayerTimes] = useState(null);
  const [monthlyData, setMonthlyData] = useState([]);
  const [fullRamadanData, setFullRamadanData] = useState([]); // Full 29 days of Ramadan
  const [ramadanInfo, setRamadanInfo] = useState({ isRamadan: false });
  const [countdown, setCountdown] = useState({ hours: "00", minutes: "00", seconds: "00", total: 0 });
  const [loading, setLoading] = useState(true);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [iftarPassed, setIftarPassed] = useState(false);
  const [adImageError, setAdImageError] = useState(false);
  
  // Refs for interval management (prevents memory leaks)
  const countdownIntervalRef = useRef(null);
  const dateCheckIntervalRef = useRef(null);

  // ============================================
  // THEME INITIALIZATION - Dark mode by default
  // ============================================
  useEffect(() => {
    const savedTheme = localStorage.getItem("prayer-theme");
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      setTheme("dark");
      localStorage.setItem("prayer-theme", "dark");
    }
  }, []);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
    localStorage.setItem("prayer-theme", theme);
  }, [theme]);

  // ============================================
  // CITY INITIALIZATION
  // ============================================
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlCity = urlParams.get("city");
    
    if (urlCity) {
      const found = TURKISH_CITIES.find(c => 
        c.name.toLowerCase() === urlCity.toLowerCase() ||
        c.displayName.toLowerCase() === urlCity.toLowerCase()
      );
      if (found) {
        setCity(found);
        localStorage.setItem("prayer-city", JSON.stringify(found));
        return;
      }
    }
    
    const savedCity = localStorage.getItem("prayer-city");
    if (savedCity) {
      try {
        const parsed = JSON.parse(savedCity);
        if (parsed.ilceId) {
          setCity(parsed);
          return;
        }
      } catch (e) {
        console.error("Failed to parse saved city");
      }
    }
    
    // Default to Erzincan
    const defaultCity = TURKISH_CITIES.find(c => c.name === "Erzincan") || TURKISH_CITIES[0];
    setCity(defaultCity);
    localStorage.setItem("prayer-city", JSON.stringify(defaultCity));
  }, []);

  // ============================================
  // FETCH PRAYER TIMES FROM DIYANET API
  // ============================================
  const fetchPrayerTimes = useCallback(async (selectedCity) => {
    if (!selectedCity || !selectedCity.ilceId) return;
    
    setLoading(true);
    
    try {
      const today = new Date();
      const cacheKey = `diyanet-times-${selectedCity.ilceId}-${today.toDateString()}`;
      const cached = localStorage.getItem(cacheKey);
      
      if (cached) {
        try {
          const data = JSON.parse(cached);
          processApiData(data, today);
          setLoading(false);
          return;
        } catch (e) {
          localStorage.removeItem(cacheKey);
        }
      }
      
      // Fetch from Diyanet API
      const response = await fetch(`${API_BASE}/vakitler/${selectedCity.ilceId}`);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data || data.length === 0) {
        throw new Error("No data received from API");
      }
      
      // Cache the data
      localStorage.setItem(cacheKey, JSON.stringify(data));
      
      processApiData(data, today);
      
    } catch (error) {
      console.error("Failed to fetch prayer times:", error);
      toast.error("Namaz vakitleri alınamadı. Lütfen tekrar deneyin.");
      
      // Try fallback
      const fallbackKey = `diyanet-times-${selectedCity.ilceId}`;
      const fallback = localStorage.getItem(fallbackKey);
      if (fallback) {
        try {
          const data = JSON.parse(fallback);
          processApiData(data, new Date());
          toast.info("Önbellek verileri kullanılıyor.");
        } catch (e) {
          // No fallback available
        }
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Process API data and update state
  const processApiData = useCallback((data, today) => {
    setMonthlyData(data);
    
    // Find today's prayer times
    const todayStr = `${today.getDate().toString().padStart(2, "0")}.${(today.getMonth() + 1).toString().padStart(2, "0")}.${today.getFullYear()}`;
    
    const todayData = data.find(day => day.MiladiTarihKisa === todayStr);
    
    if (todayData) {
      setPrayerTimes({
        Imsak: todayData.Imsak,
        Gunes: todayData.Gunes,
        Ogle: todayData.Ogle,
        Ikindi: todayData.Ikindi,
        Aksam: todayData.Aksam,
        Yatsi: todayData.Yatsi,
        raw: todayData
      });
    } else if (data.length > 0) {
      const firstDay = data[0];
      setPrayerTimes({
        Imsak: firstDay.Imsak,
        Gunes: firstDay.Gunes,
        Ogle: firstDay.Ogle,
        Ikindi: firstDay.Ikindi,
        Aksam: firstDay.Aksam,
        Yatsi: firstDay.Yatsi,
        raw: firstDay
      });
    }
    
    // Calculate Ramadan info
    const ramadan = getRamadanInfo();
    setRamadanInfo(ramadan);
    
    // Extract Ramadan days from current data
    if (ramadan.isRamadan) {
      const ramadanDays = data.filter(day => {
        // Parse date from DD.MM.YYYY format
        const parts = day.MiladiTarihKisa.split(".");
        if (parts.length === 3) {
          const date = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
          return isDateInRamadan(date);
        }
        return false;
      });
      setFullRamadanData(ramadanDays);
    }
  }, []);

  // Fetch times when city changes
  useEffect(() => {
    if (city) {
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
        countdownIntervalRef.current = null;
      }
      
      setPrayerTimes(null);
      setCountdown({ hours: "00", minutes: "00", seconds: "00", total: 0 });
      setIftarPassed(false);
      
      fetchPrayerTimes(city);
    }
  }, [city, fetchPrayerTimes]);

  // ============================================
  // FETCH FULL RAMADAN DATA (Feb + March)
  // ============================================
  const fetchFullRamadanSchedule = useCallback(async () => {
    if (!city || !city.ilceId) return [];
    
    const cacheKey = `ramadan-full-${city.ilceId}-2026`;
    const cached = localStorage.getItem(cacheKey);
    
    if (cached) {
      try {
        const data = JSON.parse(cached);
        if (data.length >= 28) { // At least 28 days
          setFullRamadanData(data);
          return data;
        }
      } catch (e) {
        localStorage.removeItem(cacheKey);
      }
    }
    
    try {
      // Fetch current month data
      const response = await fetch(`${API_BASE}/vakitler/${city.ilceId}`);
      if (!response.ok) throw new Error("API error");
      
      const data = await response.json();
      
      // Create a map of date -> prayer times from API
      const apiDataMap = {};
      data.forEach(day => {
        apiDataMap[day.MiladiTarihKisa] = day;
      });
      
      // Build complete Ramadan schedule using ALL_RAMADAN_DATES
      const completeRamadanData = ALL_RAMADAN_DATES.map(ramadanDate => {
        const apiDay = apiDataMap[ramadanDate.dateStr];
        
        if (apiDay) {
          return {
            ...apiDay,
            ramadanDay: ramadanDate.dayNumber
          };
        } else {
          // Day not in API response - create placeholder
          return {
            MiladiTarihKisa: ramadanDate.dateStr,
            Imsak: "--:--",
            Gunes: "--:--",
            Ogle: "--:--",
            Ikindi: "--:--",
            Aksam: "--:--",
            Yatsi: "--:--",
            ramadanDay: ramadanDate.dayNumber,
            isPlaceholder: true
          };
        }
      });
      
      localStorage.setItem(cacheKey, JSON.stringify(completeRamadanData));
      setFullRamadanData(completeRamadanData);
      
      return completeRamadanData;
    } catch (error) {
      console.error("Failed to fetch Ramadan schedule:", error);
      return fullRamadanData;
    }
  }, [city, fullRamadanData]);

  // ============================================
  // COUNTDOWN TIMER
  // ============================================
  useEffect(() => {
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
    
    if (!prayerTimes || !prayerTimes.Aksam) return;
    
    const updateCountdown = () => {
      const now = new Date();
      const aksamTime = parseTimeToDate(prayerTimes.Aksam);
      const yatsiTime = parseTimeToDate(prayerTimes.Yatsi);
      
      if (!aksamTime || !yatsiTime) return;
      
      let diff = aksamTime - now;
      
      if (diff <= 0 && now < yatsiTime) {
        setIftarPassed(true);
        setCountdown({ hours: "00", minutes: "00", seconds: "00", total: 0 });
      } else if (now >= yatsiTime) {
        setIftarPassed(false);
        
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowStr = `${tomorrow.getDate().toString().padStart(2, "0")}.${(tomorrow.getMonth() + 1).toString().padStart(2, "0")}.${tomorrow.getFullYear()}`;
        
        const tomorrowData = monthlyData.find(day => day.MiladiTarihKisa === tomorrowStr);
        
        if (tomorrowData) {
          const tomorrowAksam = parseTimeToDate(tomorrowData.Aksam);
          if (tomorrowAksam) {
            tomorrowAksam.setDate(tomorrow.getDate());
            tomorrowAksam.setMonth(tomorrow.getMonth());
            tomorrowAksam.setFullYear(tomorrow.getFullYear());
            diff = tomorrowAksam - now;
          }
        } else {
          const nextAksam = new Date(aksamTime);
          nextAksam.setDate(nextAksam.getDate() + 1);
          diff = nextAksam - now;
        }
        
        setCountdown(formatCountdown(diff));
      } else {
        setIftarPassed(false);
        setCountdown(formatCountdown(diff));
      }
    };
    
    updateCountdown();
    countdownIntervalRef.current = setInterval(updateCountdown, 1000);
    
    return () => {
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
        countdownIntervalRef.current = null;
      }
    };
  }, [prayerTimes, monthlyData]);

  // ============================================
  // DATE CHANGE CHECK
  // ============================================
  useEffect(() => {
    if (dateCheckIntervalRef.current) {
      clearInterval(dateCheckIntervalRef.current);
    }
    
    let lastDate = new Date().toDateString();
    
    const checkDateChange = () => {
      const currentDate = new Date().toDateString();
      if (currentDate !== lastDate) {
        lastDate = currentDate;
        if (city) {
          fetchPrayerTimes(city);
        }
        // Update Ramadan info on date change
        setRamadanInfo(getRamadanInfo());
      }
    };
    
    dateCheckIntervalRef.current = setInterval(checkDateChange, 60000);
    
    return () => {
      if (dateCheckIntervalRef.current) {
        clearInterval(dateCheckIntervalRef.current);
      }
    };
  }, [city, fetchPrayerTimes]);

  // ============================================
  // EVENT HANDLERS
  // ============================================
  const handleCityChange = useCallback((cityName) => {
    const newCity = TURKISH_CITIES.find(c => c.name === cityName);
    if (newCity) {
      setPrayerTimes(null);
      setMonthlyData([]);
      setFullRamadanData([]);
      setCity(newCity);
      localStorage.setItem("prayer-city", JSON.stringify(newCity));
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(prev => {
      const newTheme = prev === "light" ? "dark" : "light";
      localStorage.setItem("prayer-theme", newTheme);
      return newTheme;
    });
  }, []);

  const handleScheduleOpen = useCallback(() => {
    setScheduleOpen(true);
    fetchFullRamadanSchedule();
  }, [fetchFullRamadanSchedule]);

  // Prayer order for display
  const prayerOrder = ["Imsak", "Gunes", "Ogle", "Ikindi", "Aksam", "Yatsi"];

  // ============================================
  // RENDER
  // ============================================
  return (
    <div className="min-h-screen bg-background transition-colors duration-500" data-testid="prayer-app">
      <Toaster position="top-center" richColors />
      
      {/* Ramadan Progress Bar */}
      {ramadanInfo.isRamadan && (
        <div className="fixed top-0 left-0 right-0 z-50" data-testid="ramadan-progress">
          <Progress value={ramadanInfo.progress} className="h-1 rounded-none" />
          <div className="bg-primary/10 backdrop-blur-sm py-2 px-4 text-center">
            <span className="text-sm font-medium text-primary">
              Ramazan'ın {ramadanInfo.dayOfRamadan}. günü — %{Math.round(ramadanInfo.progress)}
            </span>
          </div>
        </div>
      )}
      
      {/* Advertisement Area - Below Ramadan bar */}
      {!adImageError && (
        <div 
          className={`w-full flex justify-center bg-muted/30 ${ramadanInfo.isRamadan ? "mt-12" : ""}`}
          data-testid="ad-container"
        >
          <div className="w-full max-w-5xl h-[80px] flex items-center justify-center overflow-hidden">
            <img 
              src="./reklam.png" 
              alt="Reklam"
              className="max-w-full max-h-full object-contain"
              onError={() => setAdImageError(true)}
              data-testid="ad-image"
            />
          </div>
        </div>
      )}
      
      <div className="container mx-auto px-4 md:px-8 py-8 max-w-5xl">
        {/* Header */}
        <header className="flex items-center justify-between mb-12 animate-fade-in-up">
          {/* City Selector */}
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary opacity-70" />
            <Select value={city?.name || ""} onValueChange={handleCityChange}>
              <SelectTrigger 
                className="bg-transparent border-none text-xl md:text-2xl font-light hover:bg-transparent hover:text-primary focus:ring-0 focus:ring-offset-0 px-0 shadow-none gap-2 w-auto"
                data-testid="city-selector"
              >
                <SelectValue placeholder="Şehir seçin" />
              </SelectTrigger>
              <SelectContent>
                {TURKISH_CITIES.map(c => (
                  <SelectItem 
                    key={c.name} 
                    value={c.name} 
                    data-testid={`city-option-${c.name.toLowerCase().replace(/[İıĞğÜüŞşÖöÇç]/g, char => {
                      const map = { 'İ': 'i', 'ı': 'i', 'Ğ': 'g', 'ğ': 'g', 'Ü': 'u', 'ü': 'u', 'Ş': 's', 'ş': 's', 'Ö': 'o', 'ö': 'o', 'Ç': 'c', 'ç': 'c' };
                      return map[char] || char;
                    })}`}
                  >
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-full hover:bg-secondary transition-all duration-300"
            data-testid="theme-toggle"
          >
            {theme === "light" ? (
              <Moon className="w-5 h-5 transition-transform duration-300" />
            ) : (
              <Sun className="w-5 h-5 transition-transform duration-300" />
            )}
          </Button>
        </header>
        
        {/* Hero - Countdown */}
        <section className="flex flex-col items-center justify-center min-h-[40vh] md:min-h-[45vh] mb-12 animate-fade-in-up animation-delay-100" data-testid="countdown-section">
          {loading ? (
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
              <p className="text-muted-foreground">Yükleniyor...</p>
            </div>
          ) : iftarPassed ? (
            <div className="text-center">
              <p className="text-xs uppercase tracking-[0.2em] font-bold text-muted-foreground mb-4">
                İftar Vakti
              </p>
              <h1 className="text-3xl md:text-5xl font-light text-primary mb-4">
                İftar vakti geldi!
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground">
                Afiyet olsun
              </p>
            </div>
          ) : (
            <>
              <p className="text-xs uppercase tracking-[0.2em] font-bold text-muted-foreground mb-4">
                İftar'a Kalan Süre
              </p>
              
              {/* Countdown Timer */}
              <div className="flex items-center gap-2 md:gap-4 mb-6" data-testid="countdown-timer">
                <div className="flex flex-col items-center">
                  <span className="countdown-digit text-6xl md:text-9xl font-extralight tracking-tighter tabular-nums text-foreground">
                    {countdown.hours}
                  </span>
                  <span className="text-xs uppercase tracking-wider text-muted-foreground mt-2">Saat</span>
                </div>
                <span className="text-4xl md:text-6xl font-extralight text-primary/50 -mt-6">:</span>
                <div className="flex flex-col items-center">
                  <span className="countdown-digit text-6xl md:text-9xl font-extralight tracking-tighter tabular-nums text-foreground">
                    {countdown.minutes}
                  </span>
                  <span className="text-xs uppercase tracking-wider text-muted-foreground mt-2">Dakika</span>
                </div>
                <span className="text-4xl md:text-6xl font-extralight text-primary/50 -mt-6">:</span>
                <div className="flex flex-col items-center">
                  <span className="countdown-digit text-6xl md:text-9xl font-extralight tracking-tighter tabular-nums text-foreground">
                    {countdown.seconds}
                  </span>
                  <span className="text-xs uppercase tracking-wider text-muted-foreground mt-2">Saniye</span>
                </div>
              </div>
              
              {/* Iftar Time */}
              {prayerTimes && (
                <div className="text-center">
                  <p className="text-muted-foreground text-sm mb-1">Bugünkü İftar Vakti</p>
                  <p className="text-3xl md:text-4xl font-light text-primary" data-testid="iftar-time">
                    {prayerTimes.Aksam}
                  </p>
                </div>
              )}
            </>
          )}
        </section>
        
        {/* Prayer Times Grid */}
        {prayerTimes && (
          <section className="mb-12 animate-fade-in-up animation-delay-200" data-testid="prayer-times-grid">
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
              {prayerOrder.map((prayer, index) => {
                const Icon = PRAYER_ICONS[prayer];
                const isIftar = prayer === "Aksam";
                
                return (
                  <div
                    key={prayer}
                    className={`prayer-card flex flex-col items-center justify-center p-6 rounded-2xl bg-card border transition-all duration-300 hover:border-primary/50 hover:shadow-lg ${
                      isIftar 
                        ? "ring-2 ring-primary bg-primary/5 border-primary shadow-lg pulse-glow md:col-span-1" 
                        : "border-border/50"
                    }`}
                    data-testid={`prayer-card-${prayer.toLowerCase()}`}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <Icon className={`w-6 h-6 mb-3 ${isIftar ? "text-primary" : "text-muted-foreground"}`} strokeWidth={1.5} />
                    <span className="text-xs uppercase tracking-[0.15em] font-bold text-muted-foreground mb-2">
                      {PRAYER_NAMES[prayer]}
                    </span>
                    <span className={`text-2xl font-light tabular-nums ${isIftar ? "text-primary" : "text-foreground"}`}>
                      {prayerTimes[prayer]}
                    </span>
                  </div>
                );
              })}
            </div>
          </section>
        )}
        
        {/* Ramadan Schedule Button */}
        <section className="flex justify-center mb-12 animate-fade-in-up animation-delay-300">
          <Dialog open={scheduleOpen} onOpenChange={setScheduleOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="gap-2 rounded-full px-6 py-5 text-base hover:bg-primary hover:text-primary-foreground transition-all btn-press"
                onClick={handleScheduleOpen}
                data-testid="schedule-button"
              >
                <Calendar className="w-5 h-5" />
                {ramadanInfo.isRamadan ? "Ramazan İmsakiyesi" : "Aylık Takvim"}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[80vh] p-0" data-testid="schedule-modal">
              <DialogHeader className="p-6 pb-0">
                <DialogTitle className="text-2xl font-light flex items-center gap-2">
                  <Calendar className="w-6 h-6 text-primary" />
                  {city?.name} — {ramadanInfo.isRamadan ? "Ramazan İmsakiyesi 2026" : "Aylık Namaz Vakitleri"}
                </DialogTitle>
                <DialogDescription className="text-sm text-muted-foreground mt-1">
                  {ramadanInfo.isRamadan 
                    ? "19 Şubat - 19 Mart 2026 (29 gün)" 
                    : `${city?.name} için aylık namaz vakitleri`
                  }
                </DialogDescription>
              </DialogHeader>
              <ScrollArea className="h-[60vh] px-6 pb-6">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="sticky top-0 bg-background z-10">
                      <tr className="border-b">
                        {ramadanInfo.isRamadan ? (
                          <th className="text-center py-3 px-2 font-medium text-primary">Gün</th>
                        ) : null}
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
                      {(ramadanInfo.isRamadan ? fullRamadanData : monthlyData).map((day, index) => {
                        const today = new Date();
                        const todayStr = `${today.getDate().toString().padStart(2, "0")}.${(today.getMonth() + 1).toString().padStart(2, "0")}.${today.getFullYear()}`;
                        const isToday = day.MiladiTarihKisa === todayStr;
                        
                        // Use ramadanDay from data or calculate
                        const ramadanDay = day.ramadanDay || index + 1;
                        const isPlaceholder = day.isPlaceholder;
                        
                        return (
                          <tr 
                            key={index} 
                            className={`border-b transition-colors ${isToday ? "bg-primary/10" : "hover:bg-muted/50"} ${isPlaceholder ? "opacity-50" : ""}`}
                            data-testid={`schedule-row-${index}`}
                          >
                            {ramadanInfo.isRamadan ? (
                              <td className="text-center py-3 px-2 font-bold text-primary">
                                {ramadanDay}
                              </td>
                            ) : null}
                            <td className="py-3 px-2 font-medium whitespace-nowrap">
                              {day.MiladiTarihKisa}
                            </td>
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
              </ScrollArea>
            </DialogContent>
          </Dialog>
        </section>
        
        {/* Footer */}
        <footer className="text-center text-sm text-muted-foreground animate-fade-in-up animation-delay-400 space-y-2">
          <p>Namaz vakitleri T.C. Diyanet İşleri Başkanlığı verilerine dayanmaktadır.</p>
          <p className="text-xs opacity-70">This site was developed by Seyrani Kenger.</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
