import React, { useRef, useEffect } from 'react';
import { Play, Pause, AlertCircle } from 'lucide-react';
import { Sound } from '@/types';
import { useAudio, AVAILABLE_SOUNDS } from '@/context/AudioContext';

const getSoundColors = (color: string = 'purple') => {
    const colors: Record<string, { bg: string, text: string, slider: string, border: string, shadow: string }> = {
        blue: { bg: 'bg-blue-600', text: 'text-blue-400', slider: '#3b82f6', border: 'border-blue-500/30', shadow: 'shadow-[0_0_12px_rgba(59,130,246,0.3)]' },
        orange: { bg: 'bg-orange-600', text: 'text-orange-400', slider: '#f97316', border: 'border-orange-500/30', shadow: 'shadow-[0_0_12px_rgba(249,115,22,0.3)]' },
        cyan: { bg: 'bg-cyan-600', text: 'text-cyan-400', slider: '#06b6d4', border: 'border-cyan-500/30', shadow: 'shadow-[0_0_12px_rgba(6,182,212,0.3)]' },
        teal: { bg: 'bg-teal-600', text: 'text-teal-400', slider: '#14b8a6', border: 'border-teal-500/30', shadow: 'shadow-[0_0_12px_rgba(20,184,166,0.3)]' },
        amber: { bg: 'bg-amber-600', text: 'text-amber-400', slider: '#f59e0b', border: 'border-amber-500/30', shadow: 'shadow-[0_0_12px_rgba(245,158,11,0.3)]' },
        green: { bg: 'bg-green-600', text: 'text-green-400', slider: '#22c55e', border: 'border-green-500/30', shadow: 'shadow-[0_0_12px_rgba(34,197,94,0.3)]' },
        yellow: { bg: 'bg-yellow-600', text: 'text-yellow-400', slider: '#eab308', border: 'border-yellow-500/30', shadow: 'shadow-[0_0_12px_rgba(234,179,8,0.3)]' },
        indigo: { bg: 'bg-indigo-600', text: 'text-indigo-400', slider: '#6366f1', border: 'border-indigo-500/30', shadow: 'shadow-[0_0_12px_rgba(99,102,241,0.3)]' },
        sky: { bg: 'bg-sky-600', text: 'text-sky-400', slider: '#0ea5e9', border: 'border-sky-500/30', shadow: 'shadow-[0_0_12px_rgba(14,165,233,0.3)]' },
        purple: { bg: 'bg-purple-600', text: 'text-purple-400', slider: '#a855f7', border: 'border-purple-500/30', shadow: 'shadow-[0_0_12px_rgba(168,85,247,0.3)]' },
    };
    return colors[color] || colors.purple;
};

const AudioController = ({
    sound,
    isPlaying,
    volume,
    onError
}: {
    sound: Sound;
    isPlaying: boolean;
    volume: number;
    onError: (id: string, message: string) => void;
}) => {
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        const audio = new Audio();
        // Removed crossOrigin="anonymous" as it often causes ERR_FAILED on servers that don't explicitly allow it
        audio.src = sound.src;
        audio.loop = true;
        // Ensure volume is finite and between 0 and 1
        audio.volume = isFinite(volume) ? Math.max(0, Math.min(1, volume)) : 0.5;

        audio.addEventListener('error', (e) => {
            const error = audio.error;
            let message = "Unknown error";
            if (error) {
                switch (error.code) {
                    case 1: message = "Load aborted"; break;
                    case 2: message = "Network error"; break;
                    case 3: message = "Decode error"; break;
                    case 4: message = "Source not supported"; break;
                }
            }
            // Use console.warn instead of console.error to prevent Next.js error overlay from showing
            console.warn(`Audio issues for ${sound.name}:`, message);
            onError(sound.id, message);
        });

        audioRef.current = audio;

        return () => {
            audio.pause();
            audio.src = ""; // Clear source to stop downloads
            audioRef.current = null;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sound.src]);

    useEffect(() => {
        if (audioRef.current) {
            if (isPlaying) {
                const playPromise = audioRef.current.play();
                if (playPromise !== undefined) {
                    playPromise.catch(error => {
                        // Silence the play interruption errors in dev overlay
                        console.warn(`Playback failed for ${sound.name}:`, error.message);
                        onError(sound.id, error.message || "Playback failed");
                    });
                }
            } else {
                audioRef.current.pause();
            }
        }
    }, [isPlaying, sound.id]); // Fix: sound.id for better reactivity if sources swap

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = isFinite(volume) ? Math.max(0, Math.min(1, volume)) : 0.5;
        }
    }, [volume]);

    return null;
};

export default function SoundMixer() {
    const { activeSounds, toggleSound, setSoundVolume, handleSoundError, masterVolume } = useAudio();

    return (
        <div className="bg-zen-card p-4 md:p-6 rounded-3xl shadow-lg border border-white/5 min-h-[300px] flex flex-col h-full">
            <h2 className="text-lg md:text-xl font-medium mb-4 md:mb-6 text-zen-text flex items-center gap-3">
                <span className="w-1.5 h-6 bg-purple-500 rounded-full shadow-[0_0_10px_rgba(168,85,247,0.4)]"></span>
                Ambient Sounds
            </h2>

            <div className="flex-1 overflow-y-auto pr-1 md:pr-2 space-y-3 custom-scrollbar">
                {AVAILABLE_SOUNDS.map((sound) => {
                    const state = activeSounds[sound.id] || { isPlaying: false, volume: 0.5 };
                    const theme = getSoundColors(sound.color);

                    return (
                        <div key={sound.id} className={`group bg-zen-accent/30 p-4 rounded-xl hover:bg-zen-accent/50 transition-all border ${state.error ? 'border-red-500/30' : `border-transparent hover:${theme.border}`}`}>
                            {/* Hidden Audio Controller */}
                            <AudioController
                                sound={sound}
                                isPlaying={state.isPlaying}
                                volume={state.volume * masterVolume}
                                onError={handleSoundError}
                            />

                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => toggleSound(sound.id)}
                                    className={`p-2 rounded-xl transition-all active:scale-95 ${state.isPlaying
                                        ? `${theme.bg} text-white ${theme.shadow}`
                                        : state.error
                                            ? 'bg-red-500/20 text-red-400'
                                            : 'bg-zen-card text-zen-muted'
                                        }`}
                                >
                                    {state.isPlaying ? <Pause size={18} strokeWidth={2.5} /> : <Play size={18} strokeWidth={2.5} className="ml-0.5" />}
                                </button>

                                <div className="flex-1 flex flex-col gap-2">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className={`transition-colors ${state.isPlaying ? theme.text : state.error ? 'text-red-400/60' : 'text-zen-muted'}`}>
                                                {sound.icon}
                                            </div>
                                            <span className={`text-sm font-medium transition-colors ${state.isPlaying ? 'text-white' : state.error ? 'text-red-400' : 'text-zen-muted'}`}>
                                                {sound.name}
                                            </span>
                                        </div>
                                        {state.error && (
                                            <div className="group/error relative">
                                                <AlertCircle size={14} className="text-red-500 cursor-help" />
                                                <div className="absolute bottom-full right-0 mb-2 w-48 p-2 bg-red-900 text-red-100 text-[10px] rounded shadow-xl opacity-0 group-hover/error:opacity-100 pointer-events-none transition-opacity z-50">
                                                    {state.error}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <input
                                            type="range"
                                            min="0"
                                            max="1"
                                            step="0.01"
                                            value={state.volume}
                                            onChange={(e) => setSoundVolume(sound.id, parseFloat(e.target.value))}
                                            className="w-full h-1 bg-zen-bg rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2.5 [&::-webkit-slider-thumb]:h-2.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white transition-opacity"
                                            disabled={!!state.error}
                                            style={{
                                                background: state.error
                                                    ? '#450a0a'
                                                    : `linear-gradient(to right, ${theme.slider} ${state.volume * 100}%, #1a1c23 ${state.volume * 100}%)`
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
