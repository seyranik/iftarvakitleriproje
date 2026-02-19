import { useState, useEffect, useCallback, useMemo } from "react";
import "@/App.css";
import { Sun, Moon, Sunrise, CloudSun, Sunset, Calendar, MapPin, ChevronDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

// Turkish cities with coordinates
const TURKISH_CITIES = [
  { name: "Adana", lat: 37.0, lng: 35.3213 },
  { name: "Ankara", lat: 39.9334, lng: 32.8597 },
  { name: "Antalya", lat: 36.8969, lng: 30.7133 },
  { name: "Bursa", lat: 40.1885, lng: 29.061 },
  { name: "Diyarbakır", lat: 37.9144, lng: 40.2306 },
  { name: "Erzincan", lat: 39.7500, lng: 39.5000 },
  { name: "Erzurum", lat: 39.9043, lng: 41.2679 },
  { name: "Eskişehir", lat: 39.7767, lng: 30.5206 },
  { name: "Gaziantep", lat: 37.0662, lng: 37.3833 },
  { name: "Istanbul", lat: 41.0082, lng: 28.9784 },
  { name: "İzmir", lat: 38.4237, lng: 27.1428 },
  { name: "Kayseri", lat: 38.7312, lng: 35.4787 },
  { name: "Konya", lat: 37.8746, lng: 32.4932 },
  { name: "Malatya", lat: 38.3552, lng: 38.3095 },
  { name: "Mersin", lat: 36.8121, lng: 34.6415 },
  { name: "Samsun", lat: 41.2867, lng: 36.33 },
  { name: "Trabzon", lat: 41.0027, lng: 39.7168 },
  { name: "Van", lat: 38.4891, lng: 43.4089 },
];

// Prayer names in Turkish
const PRAYER_NAMES = {
  Fajr: "İmsak",
  Sunrise: "Güneş",
  Dhuhr: "Öğle",
  Asr: "İkindi",
  Maghrib: "Akşam",
  Isha: "Yatsı"
};

// Prayer icons
const PRAYER_ICONS = {
  Fajr: Sunrise,
  Sunrise: Sun,
  Dhuhr: Sun,
  Asr: CloudSun,
  Maghrib: Sunset,
  Isha: Moon
};

// Get Ramadan dates (approximate - based on Islamic calendar)
function getRamadanInfo() {
  // Ramadan 2025: ~Feb 28 - Mar 29
  // Ramadan 2026: ~Feb 17 - Mar 18
  const now = new Date();
  const year = now.getFullYear();
  
  // Approximate Ramadan dates for 2025-2026
  const ramadanDates = {
    2025: { start: new Date(2025, 1, 28), end: new Date(2025, 2, 29) },
    2026: { start: new Date(2026, 1, 17), end: new Date(2026, 2, 18) }
  };
  
  const currentRamadan = ramadanDates[year];
  if (!currentRamadan) return { isRamadan: false };
  
  const isRamadan = now >= currentRamadan.start && now <= currentRamadan.end;
  
  if (isRamadan) {
    const dayOfRamadan = Math.ceil((now - currentRamadan.start) / (1000 * 60 * 60 * 24));
    const totalDays = Math.ceil((currentRamadan.end - currentRamadan.start) / (1000 * 60 * 60 * 24));
    const progress = (dayOfRamadan / totalDays) * 100;
    
    return { isRamadan: true, dayOfRamadan, totalDays, progress };
  }
  
  return { isRamadan: false };
}

// Parse time string to Date object
function parseTimeToDate(timeStr) {
  const [hours, minutes] = timeStr.split(":").map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date;
}

// Format countdown
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

// Main App Component
function App() {
  const [theme, setTheme] = useState("light");
  const [city, setCity] = useState(null);
  const [prayerTimes, setPrayerTimes] = useState(null);
  const [monthlyTimes, setMonthlyTimes] = useState([]);
  const [countdown, setCountdown] = useState({ hours: "00", minutes: "00", seconds: "00", total: 0 });
  const [loading, setLoading] = useState(true);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [iftarPassed, setIftarPassed] = useState(false);
  
  const ramadanInfo = useMemo(() => getRamadanInfo(), []);

  // Initialize theme
  useEffect(() => {
    const savedTheme = localStorage.getItem("prayer-theme");
    if (savedTheme) {
      setTheme(savedTheme);
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTheme("dark");
    }
  }, []);

  // Apply theme
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("prayer-theme", theme);
  }, [theme]);

  // Initialize city
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlCity = urlParams.get("city");
    
    if (urlCity) {
      const found = TURKISH_CITIES.find(c => c.name.toLowerCase() === urlCity.toLowerCase());
      if (found) {
        setCity(found);
        localStorage.setItem("prayer-city", JSON.stringify(found));
        return;
      }
    }
    
    const savedCity = localStorage.getItem("prayer-city");
    if (savedCity) {
      try {
        setCity(JSON.parse(savedCity));
        return;
      } catch (e) {
        console.error("Failed to parse saved city");
      }
    }
    
    // Try geolocation
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          // Find nearest city
          let nearest = TURKISH_CITIES[5]; // Default Erzincan
          let minDist = Infinity;
          
          TURKISH_CITIES.forEach(c => {
            const dist = Math.sqrt(Math.pow(c.lat - latitude, 2) + Math.pow(c.lng - longitude, 2));
            if (dist < minDist) {
              minDist = dist;
              nearest = c;
            }
          });
          
          setCity(nearest);
          localStorage.setItem("prayer-city", JSON.stringify(nearest));
          toast.success(`Konum algılandı: ${nearest.name}`);
        },
        () => {
          // Geolocation denied or failed - use default
          const defaultCity = TURKISH_CITIES.find(c => c.name === "Erzincan") || TURKISH_CITIES[0];
          setCity(defaultCity);
          localStorage.setItem("prayer-city", JSON.stringify(defaultCity));
        }
      );
    } else {
      // No geolocation - use default
      const defaultCity = TURKISH_CITIES.find(c => c.name === "Erzincan") || TURKISH_CITIES[0];
      setCity(defaultCity);
    }
  }, []);

  // Fetch prayer times
  const fetchPrayerTimes = useCallback(async () => {
    if (!city) return;
    
    setLoading(true);
    
    try {
      // Check cache first
      const cacheKey = `prayer-times-${city.name}-${new Date().toDateString()}`;
      const cached = localStorage.getItem(cacheKey);
      
      if (cached) {
        const data = JSON.parse(cached);
        setPrayerTimes(data.timings);
        setLoading(false);
        return;
      }
      
      const today = new Date();
      const response = await fetch(
        `https://api.aladhan.com/v1/timings/${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}?latitude=${city.lat}&longitude=${city.lng}&method=13`
      );
      
      if (!response.ok) throw new Error("API error");
      
      const data = await response.json();
      const timings = data.data.timings;
      
      setPrayerTimes(timings);
      localStorage.setItem(cacheKey, JSON.stringify({ timings }));
    } catch (error) {
      console.error("Failed to fetch prayer times:", error);
      toast.error("Namaz vakitleri alınamadı. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  }, [city]);

  // Fetch monthly times
  const fetchMonthlyTimes = useCallback(async () => {
    if (!city) return;
    
    try {
      const cacheKey = `prayer-monthly-${city.name}-${new Date().getMonth()}-${new Date().getFullYear()}`;
      const cached = localStorage.getItem(cacheKey);
      
      if (cached) {
        setMonthlyTimes(JSON.parse(cached));
        return;
      }
      
      const today = new Date();
      const response = await fetch(
        `https://api.aladhan.com/v1/calendar/${today.getFullYear()}/${today.getMonth() + 1}?latitude=${city.lat}&longitude=${city.lng}&method=13`
      );
      
      if (!response.ok) throw new Error("API error");
      
      const data = await response.json();
      setMonthlyTimes(data.data);
      localStorage.setItem(cacheKey, JSON.stringify(data.data));
    } catch (error) {
      console.error("Failed to fetch monthly times:", error);
    }
  }, [city]);

  useEffect(() => {
    fetchPrayerTimes();
  }, [fetchPrayerTimes]);

  // Countdown timer
  useEffect(() => {
    if (!prayerTimes) return;
    
    const updateCountdown = () => {
      const now = new Date();
      const maghribTime = parseTimeToDate(prayerTimes.Maghrib);
      const ishaTime = parseTimeToDate(prayerTimes.Isha);
      
      let diff = maghribTime - now;
      
      if (diff <= 0 && now < ishaTime) {
        // Iftar time has passed but before Isha
        setIftarPassed(true);
        setCountdown({ hours: "00", minutes: "00", seconds: "00", total: 0 });
      } else if (now >= ishaTime) {
        // After Isha - countdown to next day's Iftar
        setIftarPassed(false);
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(maghribTime.getHours(), maghribTime.getMinutes(), 0, 0);
        diff = tomorrow - now;
        setCountdown(formatCountdown(diff));
      } else {
        // Before Iftar
        setIftarPassed(false);
        setCountdown(formatCountdown(diff));
      }
    };
    
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    
    return () => clearInterval(interval);
  }, [prayerTimes]);

  // Check for date change
  useEffect(() => {
    const checkDateChange = () => {
      const now = new Date();
      if (now.getHours() === 0 && now.getMinutes() === 0) {
        fetchPrayerTimes();
      }
    };
    
    const interval = setInterval(checkDateChange, 60000);
    return () => clearInterval(interval);
  }, [fetchPrayerTimes]);

  const handleCityChange = (cityName) => {
    const newCity = TURKISH_CITIES.find(c => c.name === cityName);
    if (newCity) {
      setCity(newCity);
      localStorage.setItem("prayer-city", JSON.stringify(newCity));
    }
  };

  const toggleTheme = () => {
    setTheme(prev => prev === "light" ? "dark" : "light");
  };

  const prayerOrder = ["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"];

  return (
    <div className="min-h-screen bg-background transition-colors duration-300" data-testid="prayer-app">
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
      
      <div className={`container mx-auto px-4 md:px-8 py-8 max-w-5xl ${ramadanInfo.isRamadan ? "pt-20" : ""}`}>
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
                  <SelectItem key={c.name} value={c.name} data-testid={`city-option-${c.name.toLowerCase()}`}>
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
            className="rounded-full hover:bg-secondary transition-colors"
            data-testid="theme-toggle"
          >
            {theme === "light" ? (
              <Moon className="w-5 h-5" />
            ) : (
              <Sun className="w-5 h-5" />
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
                Afiyet olsun 🌙
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
                    {prayerTimes.Maghrib}
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
                const isIftar = prayer === "Maghrib";
                
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
        
        {/* 30-Day Schedule Button */}
        <section className="flex justify-center mb-12 animate-fade-in-up animation-delay-300">
          <Dialog open={scheduleOpen} onOpenChange={setScheduleOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="gap-2 rounded-full px-6 py-5 text-base hover:bg-primary hover:text-primary-foreground transition-all btn-press"
                onClick={() => fetchMonthlyTimes()}
                data-testid="schedule-button"
              >
                <Calendar className="w-5 h-5" />
                30 Günlük Takvim
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[80vh] p-0" data-testid="schedule-modal">
              <DialogHeader className="p-6 pb-0">
                <DialogTitle className="text-2xl font-light flex items-center gap-2">
                  <Calendar className="w-6 h-6 text-primary" />
                  {city?.name} — Aylık Namaz Vakitleri
                </DialogTitle>
              </DialogHeader>
              <ScrollArea className="h-[60vh] px-6 pb-6">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="sticky top-0 bg-background">
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
                      {monthlyTimes.map((day, index) => {
                        const isToday = new Date().getDate() === parseInt(day.date.gregorian.day);
                        return (
                          <tr 
                            key={index} 
                            className={`border-b transition-colors ${isToday ? "bg-primary/10" : "hover:bg-muted/50"}`}
                            data-testid={`schedule-row-${index}`}
                          >
                            <td className="py-3 px-2 font-medium">
                              {day.date.gregorian.day} {day.date.gregorian.month.en}
                            </td>
                            <td className="text-center py-3 px-2 tabular-nums">{day.timings.Fajr.split(" ")[0]}</td>
                            <td className="text-center py-3 px-2 tabular-nums">{day.timings.Sunrise.split(" ")[0]}</td>
                            <td className="text-center py-3 px-2 tabular-nums">{day.timings.Dhuhr.split(" ")[0]}</td>
                            <td className="text-center py-3 px-2 tabular-nums">{day.timings.Asr.split(" ")[0]}</td>
                            <td className="text-center py-3 px-2 tabular-nums font-medium text-primary">{day.timings.Maghrib.split(" ")[0]}</td>
                            <td className="text-center py-3 px-2 tabular-nums">{day.timings.Isha.split(" ")[0]}</td>
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
        <footer className="text-center text-sm text-muted-foreground animate-fade-in-up animation-delay-400">
          <p>Namaz vakitleri Aladhan API'den alınmaktadır.</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
