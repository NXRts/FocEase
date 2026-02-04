'use client';
import Timer from '@/components/Timer';
import TaskList from '@/components/TaskList';
import SoundMixer from '@/components/SoundMixer';
import PrayerTimes from '@/components/PrayerTimes';

export default function Home() {
  return (
    <div className="min-h-screen bg-zen-bg text-zen-text p-6 md:p-12 font-sans selection:bg-zen-primary/30 flex flex-col">
      <header className="max-w-[1600px] mx-auto mb-16 flex items-center justify-between w-full">
        <div>
          <h1 className="text-3xl md:text-4xl font-medium tracking-tight text-white mb-2">
            FocEase
          </h1>
          <p className="text-zen-muted text-lg font-light">
            Reclaim your concentration
          </p>
        </div>
        <div className="w-12 h-12 rounded-full bg-blue-500/80 blur-lg animate-pulse"></div>
      </header>

      <main className="max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 flex-1 w-full items-stretch">
        <div className="h-[600px] min-h-0"><Timer /></div>
        <div className="h-[600px] min-h-0"><TaskList /></div>
        <div className="h-[600px] min-h-0"><SoundMixer /></div>
        <div className="h-[600px] min-h-0"><PrayerTimes /></div>
      </main>

      <footer className="max-w-[1600px] mx-auto mt-20 flex items-center justify-center w-full text-zen-muted text-[10px] tracking-widest uppercase font-medium">
        <p>© {new Date().getFullYear()} FocEase. Stay productive.</p>
      </footer>
    </div>
  );
}
