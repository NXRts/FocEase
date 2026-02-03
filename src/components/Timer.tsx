import React, { useState } from 'react';
import { useTimer } from '@/hooks/useTimer';
import { Play, Pause, RotateCcw, Coffee, Zap, Brain, Settings, X, Save } from 'lucide-react';
import { TimerMode } from '@/types';

export default function Timer() {
    const { mode, timeLeft, isActive, progress, config, switchMode, toggleTimer, resetTimer, formatTime, updateDuration } = useTimer();
    const [showSettings, setShowSettings] = useState(false);
    const [localConfig, setLocalConfig] = useState(config);

    // Sync local config when opening settings
    React.useEffect(() => {
        if (showSettings) {
            setLocalConfig({
                focus: config.focus / 60,
                shortBreak: config.shortBreak / 60,
                longBreak: config.longBreak / 60,
            });
        }
    }, [showSettings, config]);

    const handleSaveSettings = () => {
        updateDuration('focus', localConfig.focus);
        updateDuration('shortBreak', localConfig.shortBreak);
        updateDuration('longBreak', localConfig.longBreak);
        setShowSettings(false);
    };

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
        <div className="bg-zen-card p-8 rounded-3xl shadow-lg border border-zen-accent/10 flex flex-col items-center relative overflow-hidden h-full min-h-[500px] w-full">
            {/* Background decoration */}
            <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-current to-transparent opacity-20 ${getModeColor()}`} />

            {/* Header */}
            <div className="w-full flex justify-between items-start mb-6">
                <h2 className="text-xl font-medium text-zen-text flex items-center gap-2">
                    <span className="w-1.5 h-6 rounded-full bg-emerald-500"></span>
                    Timer
                </h2>
                <button
                    onClick={() => setShowSettings(true)}
                    className="text-zen-muted hover:text-zen-text transition-colors hover:bg-zen-bg/50 p-2 rounded-full -mr-2 -mt-2"
                >
                    <Settings size={20} />
                </button>
            </div>

            {/* Timer Display */}
            <div className={`flex flex-col items-center w-full transition-all duration-300 ${showSettings ? 'scale-90 opacity-50 blur-sm' : 'scale-100 opacity-100'}`}>
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

                <div className="relative mb-6 group">
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

            {/* Settings Overlay */}
            <div className={`absolute inset-0 bg-zen-card/95 backdrop-blur-sm z-20 p-8 flex flex-col transition-all duration-300 ease-out ${showSettings ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'
                }`}>
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-medium text-zen-text">Customize Timer</h3>
                    <button onClick={() => setShowSettings(false)} className="text-zen-muted hover:text-zen-text p-2 hover:bg-zen-bg/50 rounded-lg transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 space-y-5 overflow-y-auto">
                    {/* Focus Duration */}
                    <div className="space-y-2">
                        <label className="text-xs font-medium text-zen-muted uppercase tracking-wider flex items-center gap-2">
                            <Brain size={14} className="text-zen-primary" /> Focus Duration
                        </label>
                        <div className="relative">
                            <input
                                type="number"
                                value={localConfig.focus}
                                onChange={(e) => setLocalConfig(prev => ({ ...prev, focus: parseInt(e.target.value) || 0 }))}
                                className="w-full bg-zen-bg rounded-xl py-3 px-4 text-zen-text font-medium focus:outline-none focus:ring-2 focus:ring-zen-primary/50 transition-all border border-transparent focus:border-zen-primary/30"
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-zen-muted">min</span>
                        </div>
                    </div>

                    {/* Short Break Duration */}
                    <div className="space-y-2">
                        <label className="text-xs font-medium text-zen-muted uppercase tracking-wider flex items-center gap-2">
                            <Coffee size={14} className="text-zen-secondary" /> Short Break
                        </label>
                        <div className="relative">
                            <input
                                type="number"
                                value={localConfig.shortBreak}
                                onChange={(e) => setLocalConfig(prev => ({ ...prev, shortBreak: parseInt(e.target.value) || 0 }))}
                                className="w-full bg-zen-bg rounded-xl py-3 px-4 text-zen-text font-medium focus:outline-none focus:ring-2 focus:ring-zen-secondary/50 transition-all border border-transparent focus:border-zen-secondary/30"
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-zen-muted">min</span>
                        </div>
                    </div>

                    {/* Long Break Duration */}
                    <div className="space-y-2">
                        <label className="text-xs font-medium text-zen-muted uppercase tracking-wider flex items-center gap-2">
                            <Zap size={14} className="text-zen-accent" /> Long Break
                        </label>
                        <div className="relative">
                            <input
                                type="number"
                                value={localConfig.longBreak}
                                onChange={(e) => setLocalConfig(prev => ({ ...prev, longBreak: parseInt(e.target.value) || 0 }))}
                                className="w-full bg-zen-bg rounded-xl py-3 px-4 text-zen-text font-medium focus:outline-none focus:ring-2 focus:ring-zen-accent/50 transition-all border border-transparent focus:border-zen-accent/30"
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-zen-muted">min</span>
                        </div>
                    </div>
                </div>

                <button
                    onClick={handleSaveSettings}
                    className="mt-4 w-full bg-gradient-to-r from-zen-primary to-zen-secondary text-white font-medium py-3 rounded-xl hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-zen-primary/20"
                >
                    <Save size={18} /> Save Changes
                </button>
            </div>
        </div>
    );
}
