import React, { useEffect, useState } from 'react';
import { useTimer } from '@/hooks/useTimer';
import { Play, Pause, RotateCcw, Coffee, Zap, Brain } from 'lucide-react';
import { TimerMode } from '@/types';

export default function Timer() {
    const { mode, timeLeft, isActive, progress, switchMode, toggleTimer, resetTimer, formatTime } = useTimer();

    // Circular progress calculation
    const radius = 120;
    const stroke = 8;
    const normalizedRadius = radius - stroke * 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    const getModeColor = () => {
        switch (mode) {
            case 'focus': return 'stroke-zen-primary text-zen-primary';
            case 'shortBreak': return 'stroke-zen-secondary text-zen-secondary';
            case 'longBreak': return 'stroke-zen-accent text-zen-accent';
        }
    };

    const getButtonClass = (btnMode: TimerMode) => {
        const isActiveMode = mode === btnMode;
        return `flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${isActiveMode
                ? 'bg-zen-card shadow-md text-white ring-1 ring-white/10'
                : 'text-zen-muted hover:text-zen-text hover:bg-zen-card/50'
            }`;
    };

    return (
        <div className="bg-zen-card p-8 rounded-3xl shadow-lg border border-zen-accent/10 flex flex-col items-center justify-center relative overflow-hidden">
            {/* Background decoration */}
            <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-current to-transparent opacity-20 ${getModeColor()}`} />

            <div className="flex gap-2 mb-8 bg-zen-bg/50 p-1.5 rounded-full">
                <button onClick={() => switchMode('focus')} className={getButtonClass('focus')}>
                    <Brain size={16} /> Focus
                </button>
                <button onClick={() => switchMode('shortBreak')} className={getButtonClass('shortBreak')}>
                    <Coffee size={16} /> Short
                </button>
                <button onClick={() => switchMode('longBreak')} className={getButtonClass('longBreak')}>
                    <Zap size={16} /> Long
                </button>
            </div>

            <div className="relative mb-8 group">
                <svg
                    height={radius * 2}
                    width={radius * 2}
                    className="rotate-[-90deg] transform transition-all duration-300"
                >
                    <circle
                        className="stroke-zen-bg"
                        strokeWidth={stroke}
                        fill="transparent"
                        r={normalizedRadius}
                        cx={radius}
                        cy={radius}
                    />
                    <circle
                        className={`${getModeColor()} transition-all duration-500 ease-in-out`}
                        strokeWidth={stroke}
                        strokeDasharray={circumference + ' ' + circumference}
                        style={{ strokeDashoffset }}
                        strokeLinecap="round"
                        fill="transparent"
                        r={normalizedRadius}
                        cx={radius}
                        cy={radius}
                    />
                </svg>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                    <div className="text-6xl font-light tracking-tight text-zen-text select-none">
                        {formatTime(timeLeft)}
                    </div>
                    <div className="text-zen-muted text-sm mt-2 uppercase tracking-widest font-medium">
                        {isActive ? 'Running' : 'Paused'}
                    </div>
                </div>
            </div>

            <div className="flex gap-4">
                <button
                    onClick={toggleTimer}
                    className={`flex items-center justify-center w-16 h-16 rounded-2xl transition-all ${isActive
                            ? 'bg-zen-bg text-zen-text hover:bg-zen-card'
                            : 'bg-zen-text text-zen-bg hover:bg-white hover:scale-105'
                        } shadow-lg`}
                >
                    {isActive ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" className="ml-1" />}
                </button>
                <button
                    onClick={resetTimer}
                    className="flex items-center justify-center w-16 h-16 rounded-2xl bg-zen-bg text-zen-muted hover:text-zen-text hover:bg-zen-card transition-all shadow-lg"
                >
                    <RotateCcw size={24} />
                </button>
            </div>
        </div>
    );
}
