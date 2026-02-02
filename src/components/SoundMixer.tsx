import React, { useState, useRef, useEffect } from 'react';
import { CloudRain, Flame, Waves, Wind, Volume2, VolumeX, Play, Pause } from 'lucide-react';
import { Sound } from '@/types';

// Using local public sound files for reliability
const AVAILABLE_SOUNDS: Sound[] = [
    { id: 'rain', name: 'Rain', src: '/sounds/rain.ogg', icon: <CloudRain size={20} /> },
    { id: 'fire', name: 'Fireplace', src: '/sounds/fire.ogg', icon: <Flame size={20} /> },
    { id: 'stream', name: 'River', src: '/sounds/stream.ogg', icon: <Waves size={20} /> },
    { id: 'wind', name: 'Wind', src: '/sounds/wind.ogg', icon: <Wind size={20} /> },
];

const AudioController = ({
    sound,
    isPlaying,
    volume
}: {
    sound: Sound;
    isPlaying: boolean;
    volume: number;
}) => {
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        // Initialize audio object once
        const audio = new Audio(sound.src);
        audio.loop = true;
        audio.volume = volume;
        audioRef.current = audio;

        return () => {
            audio.pause();
            audioRef.current = null;
        };
    }, [sound.src]); // Re-init if src changes (unlikely)

    useEffect(() => {
        if (audioRef.current) {
            if (isPlaying) {
                // Handle promise to avoid "play request interrupted" errors
                const playPromise = audioRef.current.play();
                if (playPromise !== undefined) {
                    playPromise.catch(error => {
                        console.error("Audio play failed:", error);
                    });
                }
            } else {
                audioRef.current.pause();
            }
        }
    }, [isPlaying]);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
        }
    }, [volume]);

    return null; // Logic only component
};

export default function SoundMixer() {
    const [activeSounds, setActiveSounds] = useState<Record<string, { isPlaying: boolean; volume: number }>>({});

    const toggleSound = (id: string) => {
        setActiveSounds(prev => {
            // Default to playing with 50% volume if starting
            if (!prev[id]) {
                return { ...prev, [id]: { isPlaying: true, volume: 0.5 } };
            }
            return { ...prev, [id]: { ...prev[id], isPlaying: !prev[id].isPlaying } };
        });
    };

    const changeVolume = (id: string, value: number) => {
        setActiveSounds(prev => {
            // If changing volume, ensure sound entry exists (even if paused)
            if (!prev[id]) {
                return { ...prev, [id]: { isPlaying: false, volume: value } };
            }
            return { ...prev, [id]: { ...prev[id], volume: value } };
        });
    };

    return (
        <div className="bg-zen-card p-6 rounded-3xl shadow-lg border border-zen-accent/10 h-full">
            <h2 className="text-xl font-medium mb-4 text-zen-text flex items-center gap-2">
                <span className="w-1.5 h-6 bg-zen-secondary rounded-full"></span>
                Ambient Sounds
            </h2>

            <div className="space-y-4">
                {AVAILABLE_SOUNDS.map((sound) => {
                    const state = activeSounds[sound.id] || { isPlaying: false, volume: 0.5 };

                    return (
                        <div key={sound.id} className="group bg-zen-bg/30 p-3 rounded-2xl hover:bg-zen-bg/50 transition-all">
                            {/* Hidden Audio Controller */}
                            <AudioController
                                sound={sound}
                                isPlaying={state.isPlaying}
                                volume={state.volume}
                            />

                            <div className="flex items-center gap-3 mb-2">
                                <button
                                    onClick={() => toggleSound(sound.id)}
                                    className={`p-2 rounded-xl transition-all ${state.isPlaying
                                            ? 'bg-zen-secondary text-white'
                                            : 'bg-zen-bg text-zen-muted hover:text-zen-text hover:bg-zen-card'
                                        }`}
                                >
                                    {state.isPlaying ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" className="ml-0.5" />}
                                </button>
                                <div className={`p-2 rounded-full ${state.isPlaying ? 'text-zen-text' : 'text-zen-muted'}`}>
                                    {sound.icon}
                                </div>
                                <span className={`text-sm font-medium ${state.isPlaying ? 'text-zen-text' : 'text-zen-muted'}`}>
                                    {sound.name}
                                </span>
                            </div>

                            <div className="flex items-center gap-3 px-1">
                                <VolumeX size={14} className="text-zen-muted" />
                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.01"
                                    value={state.volume}
                                    onChange={(e) => changeVolume(sound.id, parseFloat(e.target.value))}
                                    className="w-full h-1.5 bg-zen-bg rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-zen-highlight"
                                    disabled={!state.isPlaying && !activeSounds[sound.id]}
                                />
                                <Volume2 size={14} className="text-zen-muted" />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
