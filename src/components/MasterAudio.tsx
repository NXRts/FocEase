'use client';

import React, { useState } from 'react';
import { Volume2, Clock, Play, Pause, RotateCcw, ChevronDown } from 'lucide-react';
import { useAudio } from '@/context/AudioContext';

const TIMER_OPTIONS = [
    { label: 'No Timer', value: 0 },
    { label: '15 Minutes', value: 15 * 60 },
    { label: '30 Minutes', value: 30 * 60 },
    { label: '45 Minutes', value: 45 * 60 },
    { label: '1 Hour', value: 60 * 60 },
];

export default function MasterAudio() {
    const {
        masterVolume,
        setMasterVolume,
        activeSounds,
        playAll,
        stopAll,
        resetAll,
        timerDuration,
        setTimerDuration,
        timeLeft
    } = useAudio();

    const isAnyPlaying = Object.values(activeSounds).some(s => s.isPlaying);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="max-w-[1600px] mx-auto w-full mb-8 flex flex-wrap items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-700">
            {/* Master Volume */}
            <div className="bg-zen-card/80 backdrop-blur-md border border-white/5 px-6 py-3 rounded-2xl flex items-center gap-4 group hover:border-white/10 transition-all">
                <Volume2 className="text-zen-muted group-hover:text-purple-400 transition-colors" size={20} />
                <span className="text-sm font-medium text-zen-muted min-w-[60px]">Master</span>
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={masterVolume}
                    onChange={(e) => setMasterVolume(parseFloat(e.target.value))}
                    className="w-32 h-1.5 bg-zen-bg rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-purple-500 [&::-webkit-slider-thumb]:shadow-[0_0_8px_rgba(168,85,247,0.4)]"
                    style={{
                        background: `linear-gradient(to right, #a855f7 ${masterVolume * 100}%, #1a1c23 ${masterVolume * 100}%)`
                    }}
                />
                <span className="text-xs font-mono text-zen-muted w-10 text-right">
                    {Math.round(masterVolume * 100)}%
                </span>
            </div>

            {/* Timer Dropdown */}
            <div className="bg-zen-card/80 backdrop-blur-md border border-white/5 px-6 py-3 rounded-2xl flex items-center gap-4 group hover:border-white/10 transition-all">
                <Clock className="text-zen-muted group-hover:text-blue-400 transition-colors" size={20} />
                <div className="relative flex items-center gap-2">
                    <select
                        value={timerDuration}
                        onChange={(e) => setTimerDuration(parseInt(e.target.value))}
                        className="bg-zen-bg text-sm text-white px-4 py-1.5 rounded-xl border border-white/10 focus:outline-none focus:border-purple-500/50 appearance-none pr-10 cursor-pointer min-w-[140px]"
                    >
                        {TIMER_OPTIONS.map(opt => (
                            <option key={opt.value} value={opt.value} className="bg-zen-bg">
                                {opt.label}
                            </option>
                        ))}
                    </select>
                    <ChevronDown size={14} className="absolute right-3 text-zen-muted pointer-events-none" />
                </div>
                {timeLeft > 0 && (
                    <span className="text-xs font-mono text-blue-400 animate-pulse">
                        {formatTime(timeLeft)}
                    </span>
                )}
            </div>

            {/* Play/Pause All Button */}
            <button
                onClick={isAnyPlaying ? stopAll : playAll}
                className={`bg-gradient-to-r ${isAnyPlaying ? 'from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500' : 'from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500'} text-white px-8 py-3.5 rounded-2xl flex items-center gap-3 font-medium transition-all active:scale-95 shadow-lg shadow-purple-900/20`}
            >
                {isAnyPlaying ? (
                    <>
                        <Pause size={18} fill="currentColor" />
                        Pause All
                    </>
                ) : (
                    <>
                        <Play size={18} fill="currentColor" />
                        Play All
                    </>
                )}
            </button>

            {/* Reset Button */}
            <button
                onClick={resetAll}
                className="bg-zen-card/80 backdrop-blur-md border border-white/5 hover:bg-white/5 hover:border-white/10 text-white px-8 py-3.5 rounded-2xl flex items-center gap-3 font-medium transition-all active:scale-95"
            >
                <RotateCcw size={18} />
                Reset
            </button>
        </div>
    );
}
