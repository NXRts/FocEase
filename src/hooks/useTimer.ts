import { useState, useEffect, useCallback } from 'react';
import { TimerMode } from '@/types';
import { useLocalStorage } from './useLocalStorage';

const DEFAULT_CONFIG = {
    focus: 25 * 60,
    shortBreak: 5 * 60,
    longBreak: 15 * 60,
};

export function useTimer() {
    const [config, setConfig] = useLocalStorage('zen-timer-config', DEFAULT_CONFIG);
    const [mode, setMode] = useState<TimerMode>('focus');
    const [timeLeft, setTimeLeft] = useState(DEFAULT_CONFIG.focus);
    const [isActive, setIsActive] = useState(false);

    // Update timeLeft when config changes, but only if not active to avoid jumping
    useEffect(() => {
        if (!isActive) {
            setTimeLeft(config[mode]);
        }
    }, [config, mode, isActive]);

    const switchMode = useCallback((newMode: TimerMode) => {
        setMode(newMode);
        setTimeLeft(config[newMode]);
        setIsActive(false);
    }, [config]);

    const toggleTimer = useCallback(() => {
        setIsActive((prev) => !prev);
    }, []);

    const resetTimer = useCallback(() => {
        setIsActive(false);
        setTimeLeft(config[mode]);
    }, [mode, config]);

    const updateDuration = useCallback((newMode: TimerMode, minutes: number) => {
        setConfig(prev => ({
            ...prev,
            [newMode]: minutes * 60
        }));
    }, [setConfig]);

    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;

        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setIsActive(false);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isActive, timeLeft]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const progress = ((config[mode] - timeLeft) / config[mode]) * 100;

    return {
        mode,
        timeLeft,
        isActive,
        progress,
        config,
        switchMode,
        toggleTimer,
        resetTimer,
        formatTime,
        updateDuration
    };
}
