'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Moon, Sun, MapPin, Search, Loader2, Bell, BellOff } from 'lucide-react';

interface PrayerTimesData {
    timings: {
        Fajr: string;
        Dhuhr: string;
        Asr: string;
        Maghrib: string;
        Isha: string;
        [key: string]: string;
    };
    date: {
        readable: string;
        hijri: {
            date: string;
            month: {
                en: string;
            };
            weekday: {
                en: string;
            };
        };
    };
}

export default function PrayerTimes() {
    const [loading, setLoading] = useState(false);
    const [prayerData, setPrayerData] = useState<PrayerTimesData | null>(null);
    const [error, setError] = useState('');
    const [city, setCity] = useState('Jakarta');
    const [country, setCountry] = useState('Indonesia');
    const [searchCity, setSearchCity] = useState('Jakarta');
    const [notifEnabled, setNotifEnabled] = useState(false);
    const lastNotified = useRef<string | null>(null);

    // Initial permission check
    useEffect(() => {
        if (typeof window !== 'undefined' && 'Notification' in window) {
            setNotifEnabled(Notification.permission === 'granted');
        }
    }, []);

    const requestPermission = async () => {
        if (!('Notification' in window)) {
            alert('This browser does not support desktop notification');
            return;
        }

        if (Notification.permission === 'granted') {
            setNotifEnabled(true);
            return;
        }

        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
            setNotifEnabled(true);
            new Notification('FocEase', {
                body: 'Notifications enabled for prayer times!',
                icon: '/favicon.ico'
            });
        }
    };

    const toggleNotif = () => {
        if (!notifEnabled) {
            requestPermission();
        } else {
            setNotifEnabled(false);
        }
    };

    // Notification Check Timer
    useEffect(() => {
        if (!notifEnabled || !prayerData) return;

        const checkPrayerTimes = () => {
            const now = new Date();
            const currentTime = now.toLocaleTimeString('en-US', {
                hour12: false,
                hour: '2-digit',
                minute: '2-digit',
            });

            const prayerList = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

            for (const name of prayerList) {
                const prayerTime = prayerData.timings[name];
                if (prayerTime === currentTime && lastNotified.current !== name) {
                    new Notification('Waktunya Sholat', {
                        body: `Sudah masuk waktu ${name}. Mari sejenak beribadah.`,
                        icon: '/favicon.ico',
                        silent: false,
                    });
                    lastNotified.current = name;
                    break;
                }
            }

            // Reset lastNotified if time moves to a different minute
            if (lastNotified.current && prayerData.timings[lastNotified.current] !== currentTime) {
                lastNotified.current = null;
            }
        };

        const interval = setInterval(checkPrayerTimes, 30000); // Check every 30 seconds
        return () => clearInterval(interval);
    }, [notifEnabled, prayerData]);

    const fetchPrayerTimes = React.useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const response = await fetch(
                `https://api.aladhan.com/v1/timingsByCity?city=${searchCity}&country=${country}&method=2`
            );
            const data = await response.json();

            if (data.code === 200) {
                setPrayerData(data.data);
                setCity(searchCity); // Update display city only on success
            } else {
                setError('Location not found');
            }
        } catch (err) {
            setError('Failed to fetch data');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [searchCity, country]);

    useEffect(() => {
        fetchPrayerTimes();
    }, [fetchPrayerTimes]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        fetchPrayerTimes();
    };

    const prayers = [
        { name: 'Fajr', icon: <Moon size={18} className="text-zen-primary" /> },
        { name: 'Dhuhr', icon: <Sun size={18} className="text-yellow-400" /> },
        { name: 'Asr', icon: <Sun size={18} className="text-orange-400" /> },
        { name: 'Maghrib', icon: <Moon size={18} className="text-zen-secondary" /> },
        { name: 'Isha', icon: <Moon size={18} className="text-zen-accent" /> },
    ];

    return (
        <div className="bg-zen-card p-6 rounded-3xl shadow-lg border border-white/5 flex flex-col relative overflow-hidden h-full">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-medium text-zen-text flex items-center gap-3">
                    <span className="w-1.5 h-6 rounded-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.4)]"></span>
                    Prayer Times
                </h2>
                <div className="flex items-center gap-4">
                    <button
                        onClick={toggleNotif}
                        className={`p-2 rounded-xl transition-all ${notifEnabled
                                ? 'bg-amber-500/20 text-amber-500'
                                : 'bg-zen-accent/30 text-zen-muted hover:text-white'
                            }`}
                        title={notifEnabled ? "Disable notifications" : "Enable notifications"}
                    >
                        {notifEnabled ? <Bell size={18} /> : <BellOff size={18} />}
                    </button>
                    <div className="text-[10px] text-zen-muted text-right uppercase tracking-wider font-medium">
                        {prayerData?.date.hijri.weekday.en}, {prayerData?.date.readable}
                    </div>
                </div>
            </div>

            {/* Search */}
            <form onSubmit={handleSubmit} className="mb-8 space-y-3">
                <div className="relative">
                    <input
                        type="text"
                        value={searchCity}
                        onChange={(e) => setSearchCity(e.target.value)}
                        placeholder="Jakarta"
                        className="w-full bg-zen-accent/30 rounded-xl py-2.5 pl-10 pr-4 text-zen-text text-sm focus:outline-none focus:ring-1 focus:ring-amber-500/50 transition-all border border-transparent"
                    />
                    <MapPin size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zen-muted" />
                </div>
                <div className="relative group flex items-center">
                    <input
                        type="text"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        placeholder="Indonesia"
                        className="w-full bg-zen-accent/30 rounded-xl py-2.5 pl-4 pr-10 text-zen-text text-sm focus:outline-none focus:ring-1 focus:ring-amber-500/50 transition-all border border-transparent"
                    />
                    <button
                        type="submit"
                        className="absolute right-2 p-1.5 text-zen-muted hover:text-amber-500 transition-colors"
                    >
                        {loading ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />}
                    </button>
                </div>
            </form>

            {/* Error Message */}
            {error && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl text-center">
                    {error}
                </div>
            )}

            {/* Prayer List */}
            <div className="flex-1 overflow-y-auto pr-2 space-y-2.5 custom-scrollbar">
                {prayers.map((prayer) => (
                    <div
                        key={prayer.name}
                        className="flex items-center justify-between p-3.5 rounded-xl bg-zen-accent/20 border border-transparent hover:border-white/5 transition-all group"
                    >
                        <div className="flex items-center gap-3">
                            <div className="text-amber-500/80">
                                {prayer.icon}
                            </div>
                            <span className="text-zen-muted group-hover:text-white transition-colors text-sm font-medium">{prayer.name}</span>
                        </div>
                        <span className="text-amber-500 font-medium text-base">
                            {prayerData?.timings[prayer.name] || '--:--'}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
