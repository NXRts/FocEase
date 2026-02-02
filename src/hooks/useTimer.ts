import { useState, useEffect, useCallback } from 'react';
import { TimerMode } from '@/types';

const TIMER_CONFIG = {
    focus: 25 * 60,
    shortBreak: 5 * 60,
    longBreak: 15 * 60,
};

export function useTimer() {
    const [mode, setMode] = useState<TimerMode>('focus');
    const [timeLeft, setTimeLeft] = useState(TIMER_CONFIG.focus);
    const [isActive, setIsActive] = useState(false);

    const switchMode = useCallback((newMode: TimerMode) => {
        setMode(newMode);
        setTimeLeft(TIMER_CONFIG[newMode]);
        setIsActive(false);
    }, []);

    const toggleTimer = useCallback(() => {
        setIsActive((prev) => !prev);
    }, []);

    const resetTimer = useCallback(() => {
        setIsActive(false);
        setTimeLeft(TIMER_CONFIG[mode]);
    }, [mode]);

    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;

        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setIsActive(false);
            // Optional: Play alarm sound here
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

    const progress = ((TIMER_CONFIG[mode] - timeLeft) / TIMER_CONFIG[mode]) * 100;

    return {
        mode,
        timeLeft,
        isActive,
        progress,
        switchMode,
        toggleTimer,
        resetTimer,
        formatTime,
    };
}
