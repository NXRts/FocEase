'use client';

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Sound } from '@/types';
import { CloudRain, Flame, Waves, Wind, Coffee, Bird, CloudLightning, Moon, Music2 } from 'lucide-react';

interface AudioState {
    isPlaying: boolean;
    volume: number;
    error?: string;
}

interface AudioContextType {
    masterVolume: number;
    setMasterVolume: (volume: number) => void;
    activeSounds: Record<string, AudioState>;
    toggleSound: (id: string) => void;
    setSoundVolume: (id: string, volume: number) => void;
    handleSoundError: (id: string, message: string) => void;
    playAll: () => void;
    stopAll: () => void;
    resetAll: () => void;
    timerDuration: number; // in seconds, 0 means no timer
    setTimerDuration: (duration: number) => void;
    timeLeft: number;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AVAILABLE_SOUNDS: Sound[] = [
    { id: 'rain', name: 'Rain', src: '/audio/rain.mp3', icon: <CloudRain size={20} />, color: 'blue' },
    { id: 'fire', name: 'Fireplace', src: '/audio/fireplace.mp3', icon: <Flame size={20} />, color: 'orange' },
    { id: 'stream', name: 'River', src: '/sounds/stream.ogg', icon: <Waves size={20} />, color: 'cyan' },
    { id: 'wind', name: 'Wind', src: '/audio/wind.mp3', icon: <Wind size={20} />, color: 'teal' },
    { id: 'cafe', name: 'Cafe Ambience', src: '/audio/cafe.mp3', icon: <Coffee size={20} />, color: 'amber' },
    { id: 'birds', name: 'Morning Birds', src: '/audio/birds.mp3', icon: <Bird size={20} />, color: 'green' },
    { id: 'thunder', name: 'Thunderstorm', src: '/audio/thunder.mp3', icon: <CloudLightning size={20} />, color: 'yellow' },
    { id: 'night', name: 'Nature Night', src: '/audio/night.mp3', icon: <Moon size={20} />, color: 'indigo' },
    { id: 'ocean', name: 'Ocean Waves', src: '/audio/ocean.mp3', icon: <Waves size={20} />, color: 'sky' },
];

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [masterVolume, setMasterVolume] = useState(1);
    const [activeSounds, setActiveSounds] = useState<Record<string, AudioState>>({});
    const [timerDuration, setTimerDuration] = useState(0);
    const [timeLeft, setTimeLeft] = useState(0);
    const [isLoaded, setIsLoaded] = useState(false);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // Persistence logic - Load only once on mount
    useEffect(() => {
        const savedMasterVolume = localStorage.getItem('masterVolume');
        if (savedMasterVolume !== null) {
            setMasterVolume(parseFloat(savedMasterVolume));
        }

        const savedTimerDuration = localStorage.getItem('timerDuration');
        if (savedTimerDuration !== null) {
            setTimerDuration(parseInt(savedTimerDuration));
        }

        const savedSoundVolumes = localStorage.getItem('soundVolumes');
        if (savedSoundVolumes) {
            try {
                const volumes = JSON.parse(savedSoundVolumes) as Record<string, number>;
                const initialState: Record<string, AudioState> = {};
                Object.entries(volumes).forEach(([id, vol]) => {
                    initialState[id] = { isPlaying: false, volume: vol };
                });
                setActiveSounds(initialState);
            } catch (e) {
                console.error('Failed to parse saved sound volumes', e);
            }
        }
        setIsLoaded(true);
    }, []);

    // Save master volume whenever it changes, but only after initial load
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem('masterVolume', masterVolume.toString());
        }
    }, [masterVolume, isLoaded]);

    // Save timer duration whenever it changes, but only after initial load
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem('timerDuration', timerDuration.toString());
        }
    }, [timerDuration, isLoaded]);

    // Save individual sound volumes whenever they change, but only after initial load
    useEffect(() => {
        if (isLoaded) {
            const volumes: Record<string, number> = {};
            Object.entries(activeSounds).forEach(([id, state]) => {
                volumes[id] = state.volume;
            });
            localStorage.setItem('soundVolumes', JSON.stringify(volumes));
        }
    }, [activeSounds, isLoaded]);

    // Timer logic
    useEffect(() => {
        if (timerDuration > 0) {
            setTimeLeft(timerDuration);
            if (timerRef.current) clearInterval(timerRef.current);

            timerRef.current = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        if (timerRef.current) clearInterval(timerRef.current);
                        setActiveSounds({}); // Stop all sounds
                        setTimerDuration(0);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        } else {
            if (timerRef.current) clearInterval(timerRef.current);
            setTimeLeft(0);
        }

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [timerDuration]);

    const toggleSound = (id: string) => {
        setActiveSounds(prev => {
            const current = prev[id] || { isPlaying: false, volume: 0.5 };
            if (current.error) {
                return { ...prev, [id]: { ...current, isPlaying: true, error: undefined } };
            }
            return { ...prev, [id]: { ...current, isPlaying: !current.isPlaying } };
        });
    };

    const setSoundVolume = (id: string, volume: number) => {
        setActiveSounds(prev => {
            const current = prev[id] || { isPlaying: false, volume: 0.5 };
            return { ...prev, [id]: { ...current, volume } };
        });
    };

    const handleSoundError = (id: string, message: string) => {
        setActiveSounds(prev => {
            const current = prev[id] || { isPlaying: false, volume: 0.5 };
            if (current.error === message) return prev;
            return {
                ...prev,
                [id]: { ...current, isPlaying: false, error: message }
            };
        });
    };

    const playAll = () => {
        setActiveSounds(prev => {
            const newState: Record<string, AudioState> = { ...prev };
            AVAILABLE_SOUNDS.forEach(sound => {
                const current = prev[sound.id] || { isPlaying: false, volume: 0.5 };
                newState[sound.id] = { ...current, isPlaying: true };
            });
            return newState;
        });
    };

    const stopAll = () => {
        setActiveSounds(prev => {
            const newState: Record<string, AudioState> = { ...prev };
            Object.keys(prev).forEach(id => {
                newState[id] = { ...prev[id], isPlaying: false };
            });
            return newState;
        });
    };

    const resetAll = () => {
        setActiveSounds({});
        setMasterVolume(1);
        setTimerDuration(0);
    };

    return (
        <AudioContext.Provider value={{
            masterVolume,
            setMasterVolume,
            activeSounds,
            toggleSound,
            setSoundVolume,
            handleSoundError,
            playAll,
            stopAll,
            resetAll,
            timerDuration,
            setTimerDuration,
            timeLeft
        }}>
            {children}
        </AudioContext.Provider>
    );
};

export const useAudio = () => {
    const context = useContext(AudioContext);
    if (context === undefined) {
        throw new Error('useAudio must be used within an AudioProvider');
    }
    return context;
};
