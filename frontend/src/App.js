import { useState, useEffect, useCallback, useRef } from "react";
import "@/App.css";
import { Sun, Moon, Sunrise, CloudSun, Sunset, Calendar, MapPin, UtensilsCrossed, Soup, Beef, Wheat, Salad, CakeSlice, Star, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

// ============================================
// DIYANET API CONFIGURATION (emushaf.net)
// ============================================
const API_BASE = "https://ezanvakti.emushaf.net";

// ============================================
// STATIC MENU DATA - Embedded from JSON
// No randomization, no modification
// ============================================
const MENU_DATA = {
  "ramadan_menus": [
    { "day": 1, "type": "standard", "soup": "Ezogelin Çorbası", "main": "Fırın Tavuk But", "side": "Pirinç Pilavı", "salad_or_meze": "Çoban Salata", "dessert": "Güllaç" },
    { "day": 2, "type": "standard", "soup": "Mercimek Çorbası", "main": "Etli Kuru Fasulye", "side": "Pirinç Pilavı", "salad_or_meze": "Turşu", "dessert": "Revani" },
    { "day": 3, "type": "standard", "soup": "Yayla Çorbası", "main": "Karnıyarık", "side": "Bulgur Pilavı", "salad_or_meze": "Cacık", "dessert": "Kemalpaşa Tatlısı" },
    { "day": 4, "type": "standard", "soup": "Domates Çorbası", "main": "Tas Kebabı", "side": "Şehriyeli Pirinç Pilavı", "salad_or_meze": "Mevsim Salata", "dessert": "Sütlaç" },
    { "day": 5, "type": "standard", "soup": "Tarhana Çorbası", "main": "Fırında Köfte Patates", "side": "Yoğurtlu Makarna", "salad_or_meze": "Havuç Tarator", "dessert": "Trileçe" },
    { "day": 6, "type": "standard", "soup": "Sebze Çorbası", "main": "Tavuk Sote", "side": "Pirinç Pilavı", "salad_or_meze": "Göbek Salata", "dessert": "Kazandibi" },
    { "day": 7, "type": "standard", "soup": "Düğün Çorbası", "main": "İzmir Köfte", "side": "Bulgur Pilavı", "salad_or_meze": "Mor Lahana Salatası", "dessert": "Baklava" },
    { "day": 8, "type": "standard", "soup": "Mantar Çorbası", "main": "Etli Nohut", "side": "Pirinç Pilavı", "salad_or_meze": "Turşu", "dessert": "Muhallebi" },
    { "day": 9, "type": "standard", "soup": "Şehriye Çorbası", "main": "Ali Nazik", "side": "Fırın Patates", "salad_or_meze": "Mevsim Salata", "dessert": "Keşkül" },
    { "day": 10, "type": "standard", "soup": "Ezogelin Çorbası", "main": "Etli Taze Fasulye", "side": "Pirinç Pilavı", "salad_or_meze": "Cacık", "dessert": "Şekerpare" },
    { "day": 11, "type": "standard", "soup": "Yayla Çorbası", "main": "Fırın Tavuk Baget", "side": "Bulgur Pilavı", "salad_or_meze": "Çoban Salata", "dessert": "Güllaç" },
    { "day": 12, "type": "standard", "soup": "Mercimek Çorbası", "main": "Hünkar Beğendi", "side": "Pirinç Pilavı", "salad_or_meze": "Roka Salatası", "dessert": "Kazandibi" },
    { "day": 13, "type": "standard", "soup": "Tarhana Çorbası", "main": "Sebzeli Güveç", "side": "Şehriyeli Bulgur Pilavı", "salad_or_meze": "Yoğurtlu Salata", "dessert": "Sütlaç" },
    { "day": 14, "type": "standard", "soup": "Domates Çorbası", "main": "Izgara Köfte", "side": "Patates Püresi", "salad_or_meze": "Çoban Salata", "dessert": "Revani" },
    { "day": 15, "type": "standard", "soup": "Sebze Çorbası", "main": "Tavuk Şiş", "side": "Bulgur Pilavı", "salad_or_meze": "Göbek Salata", "dessert": "Trileçe" },
    { "day": 16, "type": "standard", "soup": "Düğün Çorbası", "main": "Etli Kabak Yemeği", "side": "Pirinç Pilavı", "salad_or_meze": "Cacık", "dessert": "Kemalpaşa Tatlısı" },
    { "day": 17, "type": "standard", "soup": "Mantar Çorbası", "main": "Sac Kavurma", "side": "Bulgur Pilavı", "salad_or_meze": "Mevsim Salata", "dessert": "Fırın Sütlaç" },
    { "day": 18, "type": "standard", "soup": "Ezogelin Çorbası", "main": "Fırında Levrek", "side": "Zeytinyağlı Enginar", "salad_or_meze": "Roka Salatası", "dessert": "Muhallebi" },
    { "day": 19, "type": "standard", "soup": "Yayla Çorbası", "main": "Kıymalı Ispanak", "side": "Pirinç Pilavı", "salad_or_meze": "Turşu", "dessert": "Şekerpare" },
    { "day": 20, "type": "standard", "soup": "Mercimek Çorbası", "main": "Beşamel Soslu Tavuk", "side": "Fırın Makarna", "salad_or_meze": "Çoban Salata", "dessert": "Kazandibi" },
    { "day": 21, "type": "standard", "soup": "Tarhana Çorbası", "main": "Etli Patlıcan Musakka", "side": "Bulgur Pilavı", "salad_or_meze": "Cacık", "dessert": "Revani" },
    { "day": 22, "type": "standard", "soup": "Domates Çorbası", "main": "Izgara Tavuk Kanat", "side": "Pirinç Pilavı", "salad_or_meze": "Mevsim Salata", "dessert": "Güllaç" },
    { "day": 23, "type": "standard", "soup": "Sebze Çorbası", "main": "Etli Bezelye", "side": "Pirinç Pilavı", "salad_or_meze": "Havuç Salatası", "dessert": "Süt Helvası" },
    { "day": 24, "type": "standard", "soup": "Düğün Çorbası", "main": "İç Pilavlı Tavuk Dolması", "side": "Zeytinyağlı Yaprak Sarma", "salad_or_meze": "Mevsim Salata", "dessert": "Baklava" },
    { "day": 25, "type": "standard", "soup": "Mantar Çorbası", "main": "Kuzu Tandır", "side": "Bulgur Pilavı", "salad_or_meze": "Roka Salatası", "dessert": "Keşkül" },
    { "day": 26, "type": "standard", "soup": "Ezogelin Çorbası", "main": "Sebzeli Tavuk Güveç", "side": "Şehriyeli Pirinç Pilavı", "salad_or_meze": "Cacık", "dessert": "Muhallebi" },
    { "day": 27, "type": "kadir_gecesi_special", "soup": "Bademli Tavuk Çorbası", "main": "Hünkar Beğendi", "side": "İç Pilav", "salad_or_meze": "Zeytinyağlı Yaprak Sarma", "dessert": "Nar ve Antep Fıstıklı Güllaç" },
    { "day": 28, "type": "standard", "soup": "Mercimek Çorbası", "main": "Fırın Köfte", "side": "Patates Püresi", "salad_or_meze": "Çoban Salata", "dessert": "Revani" },
    { "day": 29, "type": "standard", "soup": "Yayla Çorbası", "main": "Etli Kuru Fasulye", "side": "Pirinç Pilavı", "salad_or_meze": "Turşu", "dessert": "Fırın Sütlaç" }
  ],
  "eid_special_menus": [
    { "day": 1, "type": "eid_special", "soup": "Mercimek Çorbası", "main": "Kurban Kavurma", "side": "Pirinç Pilavı", "salad_or_meze": "Çoban Salata", "dessert": "Baklava" },
    { "day": 2, "type": "eid_special", "soup": "Yayla Çorbası", "main": "Fırında Tavuk Dolması", "side": "İç Pilav", "salad_or_meze": "Zeytinyağlı Yaprak Sarma", "dessert": "Şöbiyet" },
    { "day": 3, "type": "eid_special", "soup": "Ezogelin Çorbası", "main": "Izgara Köfte", "side": "Patates Püresi", "salad_or_meze": "Rus Salatası", "dessert": "Kadayıf" }
  ]
};

// Turkish cities with Diyanet API IDs
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
const RAMADAN_2026 = {
  start: new Date(2026, 1, 19), // Feb 19, 2026
  end: new Date(2026, 2, 19),   // Mar 19, 2026 (last day of Ramadan)
  totalDays: 29,
  eidStart: new Date(2026, 2, 20), // Eid starts Mar 20, 2026
  eidEnd: new Date(2026, 2, 22)    // Eid ends Mar 22, 2026 (3 days)
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

// Check if date is within Eid period
function isDateInEid(date) {
  const checkDate = new Date(date);
  checkDate.setHours(0, 0, 0, 0);
  
  const start = new Date(RAMADAN_2026.eidStart);
  start.setHours(0, 0, 0, 0);
  
  const end = new Date(RAMADAN_2026.eidEnd);
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
  
  return diffDays + 1;
}

// Get Eid day number for a given date
function getEidDayNumber(date) {
  if (!isDateInEid(date)) return null;
  
  const checkDate = new Date(date);
  checkDate.setHours(0, 0, 0, 0);
  
  const start = new Date(RAMADAN_2026.eidStart);
  start.setHours(0, 0, 0, 0);
  
  const diffTime = checkDate - start;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays + 1;
}

// Get current period info (Ramadan, Eid, or neither)
function getPeriodInfo() {
  const today = new Date();
  
  if (isDateInRamadan(today)) {
    const dayOfRamadan = getRamadanDayNumber(today);
    const totalDays = RAMADAN_2026.totalDays;
    const progress = (dayOfRamadan / totalDays) * 100;
    
    return {
      period: "ramadan",
      isRamadan: true,
      isEid: false,
      dayOfRamadan,
      totalDays,
      progress
    };
  }
  
  if (isDateInEid(today)) {
    const dayOfEid = getEidDayNumber(today);
    
    return {
      period: "eid",
      isRamadan: false,
      isEid: true,
      dayOfEid,
      totalEidDays: 3
    };
  }
  
  return { period: "none", isRamadan: false, isEid: false };
}

// Get menu for current day - DETERMINISTIC, NO RANDOMIZATION
function getCurrentMenu(periodInfo) {
  if (periodInfo.isRamadan && periodInfo.dayOfRamadan >= 1 && periodInfo.dayOfRamadan <= 29) {
    return MENU_DATA.ramadan_menus[periodInfo.dayOfRamadan - 1];
  }
  
  if (periodInfo.isEid && periodInfo.dayOfEid >= 1 && periodInfo.dayOfEid <= 3) {
    return MENU_DATA.eid_special_menus[periodInfo.dayOfEid - 1];
  }
  
  // Default to Day 1 Ramadan menu for preview
  return MENU_DATA.ramadan_menus[0];
}

// Get menu type display info
function getMenuTypeInfo(menuType) {
  switch (menuType) {
    case "kadir_gecesi_special":
      return {
        label: "Kadir Gecesi Özel",
        badgeClass: "bg-gradient-to-r from-purple-600 to-indigo-600",
        cardClass: "ring-2 ring-purple-500/50 bg-gradient-to-br from-purple-900/20 to-indigo-900/20",
        icon: Star,
        iconClass: "text-purple-400"
      };
    case "eid_special":
      return {
        label: "Bayram Özel",
        badgeClass: "bg-gradient-to-r from-amber-500 to-orange-500",
        cardClass: "ring-2 ring-amber-500/50 bg-gradient-to-br from-amber-900/20 to-orange-900/20",
        icon: Sparkles,
        iconClass: "text-amber-400"
      };
    default:
      return {
        label: null,
        badgeClass: "bg-primary",
        cardClass: "",
        icon: null,
        iconClass: ""
      };
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
  const [fullRamadanData, setFullRamadanData] = useState([]);
  const [periodInfo, setPeriodInfo] = useState({ period: "none", isRamadan: false, isEid: false });
  const [countdown, setCountdown] = useState({ hours: "00", minutes: "00", seconds: "00", total: 0 });
  const [loading, setLoading] = useState(true);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [iftarPassed, setIftarPassed] = useState(false);
  const [currentMenu, setCurrentMenu] = useState(null);
  
  // Refs for interval management
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
  // PERIOD & MENU INITIALIZATION
  // ============================================
  useEffect(() => {
    const info = getPeriodInfo();
    setPeriodInfo(info);
    setCurrentMenu(getCurrentMenu(info));
  }, []);

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
      
      const response = await fetch(`${API_BASE}/vakitler/${selectedCity.ilceId}`);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data || data.length === 0) {
        throw new Error("No data received from API");
      }
      
      localStorage.setItem(cacheKey, JSON.stringify(data));
      processApiData(data, today);
      
    } catch (error) {
      console.error("Failed to fetch prayer times:", error);
      toast.error("Namaz vakitleri alınamadı. Lütfen tekrar deneyin.");
      
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
    
    // Update period info
    const info = getPeriodInfo();
    setPeriodInfo(info);
    setCurrentMenu(getCurrentMenu(info));
    
    // Extract Ramadan days from current data
    if (info.isRamadan) {
      const ramadanDays = data.filter(day => {
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
  // FETCH FULL RAMADAN DATA
  // ============================================
  const fetchFullRamadanSchedule = useCallback(async () => {
    if (!city || !city.ilceId) return [];
    
    const cacheKey = `ramadan-full-${city.ilceId}-2026`;
    const cached = localStorage.getItem(cacheKey);
    
    if (cached) {
      try {
        const data = JSON.parse(cached);
        if (data.length >= 28) {
          setFullRamadanData(data);
          return data;
        }
      } catch (e) {
        localStorage.removeItem(cacheKey);
      }
    }
    
    try {
      const response = await fetch(`${API_BASE}/vakitler/${city.ilceId}`);
      if (!response.ok) throw new Error("API error");
      
      const data = await response.json();
      
      const apiDataMap = {};
      data.forEach(day => {
        apiDataMap[day.MiladiTarihKisa] = day;
      });
      
      const completeRamadanData = ALL_RAMADAN_DATES.map(ramadanDate => {
        const apiDay = apiDataMap[ramadanDate.dateStr];
        
        if (apiDay) {
          return {
            ...apiDay,
            ramadanDay: ramadanDate.dayNumber
          };
        } else {
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
        const info = getPeriodInfo();
        setPeriodInfo(info);
        setCurrentMenu(getCurrentMenu(info));
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

  // Get menu type styling
  const menuTypeInfo = currentMenu ? getMenuTypeInfo(currentMenu.type) : getMenuTypeInfo("standard");

  // Prayer order for display
  const prayerOrder = ["Imsak", "Gunes", "Ogle", "Ikindi", "Aksam", "Yatsi"];

  // ============================================
  // RENDER
  // ============================================
  return (
    <div className="min-h-screen bg-background transition-colors duration-500" data-testid="prayer-app">
      <Toaster position="top-center" richColors />
      
      {/* Ramadan Progress Bar */}
      {periodInfo.isRamadan && (
        <div className="fixed top-0 left-0 right-0 z-50" data-testid="ramadan-progress">
          <Progress value={periodInfo.progress} className="h-1 rounded-none" />
          <div className="bg-primary/10 backdrop-blur-sm py-2 px-4 text-center">
            <span className="text-sm font-medium text-primary">
              Ramazan'ın {periodInfo.dayOfRamadan}. günü — %{Math.round(periodInfo.progress)}
            </span>
          </div>
        </div>
      )}
      
      {/* Eid Banner */}
      {periodInfo.isEid && (
        <div className="fixed top-0 left-0 right-0 z-50" data-testid="eid-banner">
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 py-3 px-4 text-center">
            <span className="text-sm font-bold text-white flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4" />
              Ramazan Bayramı'nın {periodInfo.dayOfEid}. Günü — Bayramınız Mübarek Olsun!
              <Sparkles className="w-4 h-4" />
            </span>
          </div>
        </div>
      )}
      
      <div className={`container mx-auto px-4 md:px-8 py-8 max-w-5xl ${periodInfo.isRamadan || periodInfo.isEid ? "pt-16" : ""}`}>
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
                {periodInfo.isEid ? "Akşam Yemeğine" : "İftar'a"} Kalan Süre
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
                  <p className="text-muted-foreground text-sm mb-1">
                    {periodInfo.isEid ? "Akşam Vakti" : "Bugünkü İftar Vakti"}
                  </p>
                  <p className="text-3xl md:text-4xl font-light text-primary" data-testid="iftar-time">
                    {prayerTimes.Aksam}
                  </p>
                </div>
              )}
            </>
          )}
        </section>
        
        {/* Daily Menu Card */}
        {currentMenu && (
          <section className={`mb-8 animate-fade-in-up animation-delay-150`} data-testid="menu-section">
            <div className={`bg-card border border-border rounded-2xl overflow-hidden ${menuTypeInfo.cardClass}`}>
              {/* Menu Header */}
              <div className={`flex items-center justify-between px-5 py-4 border-b border-border ${
                currentMenu.type === "kadir_gecesi_special" 
                  ? "bg-gradient-to-r from-purple-900/30 to-indigo-900/30" 
                  : currentMenu.type === "eid_special"
                    ? "bg-gradient-to-r from-amber-900/30 to-orange-900/30"
                    : "bg-primary/5"
              }`}>
                <div className="flex items-center gap-3">
                  {menuTypeInfo.icon ? (
                    <menuTypeInfo.icon className={`w-5 h-5 ${menuTypeInfo.iconClass}`} />
                  ) : (
                    <UtensilsCrossed className="w-5 h-5 text-primary" />
                  )}
                  <div>
                    <h2 className="text-lg font-medium text-foreground">
                      {periodInfo.isEid ? "Bayram Menüsü" : "Günün İftar Menüsü"}
                    </h2>
                    {menuTypeInfo.label && (
                      <p className={`text-xs font-medium ${menuTypeInfo.iconClass}`}>
                        {menuTypeInfo.label}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {currentMenu.type === "kadir_gecesi_special" && (
                    <span className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1">
                      <Star className="w-3 h-3" />
                      Kadir Gecesi
                    </span>
                  )}
                  {currentMenu.type === "eid_special" && (
                    <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      Bayram
                    </span>
                  )}
                  <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${menuTypeInfo.badgeClass} text-primary-foreground`}>
                    {periodInfo.isRamadan 
                      ? `${periodInfo.dayOfRamadan}. Gün` 
                      : periodInfo.isEid 
                        ? `${periodInfo.dayOfEid}. Gün`
                        : "Örnek"
                    }
                  </span>
                </div>
              </div>
              
              {/* Menu Content */}
              <div className="p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                  {/* Soup */}
                  <div className="flex items-start gap-3 p-4 bg-secondary/50 rounded-xl hover:bg-secondary/80 transition-colors">
                    <div className="w-10 h-10 rounded-lg bg-amber-500 flex items-center justify-center flex-shrink-0">
                      <Soup className="w-5 h-5 text-white" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Çorba</span>
                      <p className="text-sm font-medium text-foreground leading-tight" data-testid="menu-soup">
                        {currentMenu.soup}
                      </p>
                    </div>
                  </div>
                  
                  {/* Main Dish */}
                  <div className="flex items-start gap-3 p-4 bg-secondary/50 rounded-xl hover:bg-secondary/80 transition-colors">
                    <div className="w-10 h-10 rounded-lg bg-red-500 flex items-center justify-center flex-shrink-0">
                      <Beef className="w-5 h-5 text-white" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Ana Yemek</span>
                      <p className="text-sm font-medium text-foreground leading-tight" data-testid="menu-main">
                        {currentMenu.main}
                      </p>
                    </div>
                  </div>
                  
                  {/* Side Dish */}
                  <div className="flex items-start gap-3 p-4 bg-secondary/50 rounded-xl hover:bg-secondary/80 transition-colors">
                    <div className="w-10 h-10 rounded-lg bg-violet-500 flex items-center justify-center flex-shrink-0">
                      <Wheat className="w-5 h-5 text-white" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Pilav / Yan</span>
                      <p className="text-sm font-medium text-foreground leading-tight" data-testid="menu-side">
                        {currentMenu.side}
                      </p>
                    </div>
                  </div>
                  
                  {/* Salad/Meze */}
                  <div className="flex items-start gap-3 p-4 bg-secondary/50 rounded-xl hover:bg-secondary/80 transition-colors">
                    <div className="w-10 h-10 rounded-lg bg-green-500 flex items-center justify-center flex-shrink-0">
                      <Salad className="w-5 h-5 text-white" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Salata / Meze</span>
                      <p className="text-sm font-medium text-foreground leading-tight" data-testid="menu-salad">
                        {currentMenu.salad_or_meze}
                      </p>
                    </div>
                  </div>
                  
                  {/* Dessert */}
                  <div className="flex items-start gap-3 p-4 bg-secondary/50 rounded-xl hover:bg-secondary/80 transition-colors">
                    <div className="w-10 h-10 rounded-lg bg-orange-500 flex items-center justify-center flex-shrink-0">
                      <CakeSlice className="w-5 h-5 text-white" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Tatlı</span>
                      <p className="text-sm font-medium text-foreground leading-tight" data-testid="menu-dessert">
                        {currentMenu.dessert}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Sample note for non-Ramadan/Eid */}
              {!periodInfo.isRamadan && !periodInfo.isEid && (
                <div className="px-4 py-2 bg-primary/5 border-t border-border text-center">
                  <span className="text-xs text-muted-foreground">Örnek Menü (Ramazan / Bayram Dışı)</span>
                </div>
              )}
            </div>
          </section>
        )}
        
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
                {periodInfo.isRamadan ? "Ramazan İmsakiyesi" : periodInfo.isEid ? "Bayram Programı" : "Aylık Takvim"}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[80vh] p-0 overflow-hidden" data-testid="schedule-modal">
              <DialogHeader className="p-6 pb-0">
                <DialogTitle className="text-2xl font-light flex items-center gap-2">
                  <Calendar className="w-6 h-6 text-primary" />
                  {city?.name} — {periodInfo.isRamadan ? "Ramazan İmsakiyesi 2026" : periodInfo.isEid ? "Bayram Programı" : "Aylık Namaz Vakitleri"}
                </DialogTitle>
                <DialogDescription className="text-sm text-muted-foreground mt-1">
                  {periodInfo.isRamadan 
                    ? "19 Şubat - 19 Mart 2026 (29 gün)" 
                    : periodInfo.isEid
                      ? "20 Mart - 22 Mart 2026 (3 gün)"
                      : `${city?.name} için aylık namaz vakitleri`
                  }
                </DialogDescription>
              </DialogHeader>
              <div className="h-[60vh] overflow-y-auto overflow-x-auto px-4 md:px-6 pb-6">
                <div className="min-w-[600px]">
                  <table className="w-full text-sm">
                    <thead className="sticky top-0 bg-background z-10">
                      <tr className="border-b">
                        {periodInfo.isRamadan ? (
                          <th className="text-center py-3 px-2 font-medium text-primary whitespace-nowrap">Gün</th>
                        ) : null}
                        <th className="text-left py-3 px-2 font-medium text-muted-foreground whitespace-nowrap">Tarih</th>
                        <th className="text-center py-3 px-2 font-medium text-muted-foreground whitespace-nowrap">İmsak</th>
                        <th className="text-center py-3 px-2 font-medium text-muted-foreground whitespace-nowrap">Güneş</th>
                        <th className="text-center py-3 px-2 font-medium text-muted-foreground whitespace-nowrap">Öğle</th>
                        <th className="text-center py-3 px-2 font-medium text-muted-foreground whitespace-nowrap">İkindi</th>
                        <th className="text-center py-3 px-2 font-medium text-primary font-bold whitespace-nowrap">Akşam</th>
                        <th className="text-center py-3 px-2 font-medium text-muted-foreground whitespace-nowrap">Yatsı</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(periodInfo.isRamadan ? fullRamadanData : monthlyData).map((day, index) => {
                        const today = new Date();
                        const todayStr = `${today.getDate().toString().padStart(2, "0")}.${(today.getMonth() + 1).toString().padStart(2, "0")}.${today.getFullYear()}`;
                        const isToday = day.MiladiTarihKisa === todayStr;
                        const ramadanDay = day.ramadanDay || index + 1;
                        const isPlaceholder = day.isPlaceholder;
                        const isKadirGecesi = ramadanDay === 27;
                        
                        return (
                          <tr 
                            key={index} 
                            className={`border-b transition-colors ${
                              isKadirGecesi 
                                ? "bg-purple-900/20" 
                                : isToday 
                                  ? "bg-primary/10" 
                                  : "hover:bg-muted/50"
                            } ${isPlaceholder ? "opacity-50" : ""}`}
                            data-testid={`schedule-row-${index}`}
                          >
                            {periodInfo.isRamadan ? (
                              <td className={`text-center py-3 px-2 font-bold ${isKadirGecesi ? "text-purple-400" : "text-primary"}`}>
                                {ramadanDay}
                                {isKadirGecesi && (
                                  <Star className="w-3 h-3 inline ml-1 text-purple-400" />
                                )}
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
              </div>
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
