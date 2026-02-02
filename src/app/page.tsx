'use client';
import Timer from '@/components/Timer';
import TaskList from '@/components/TaskList';
import SoundMixer from '@/components/SoundMixer';

export default function Home() {
  return (
    <div className="min-h-screen bg-zen-bg text-zen-text p-4 md:p-8 font-sans selection:bg-zen-primary/30">
      <header className="max-w-6xl mx-auto mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-light tracking-wide text-white">
            Zen Focus Space
          </h1>
          <p className="text-zen-muted text-sm mt-1">
            Reclaim your concentration
          </p>
        </div>
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-zen-primary to-zen-secondary animate-pulse-slow"></div>
      </header>

      <main className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">

        {/* Left Column: Timer (Centers on Mobile) */}
        <section className="lg:col-span-5 flex flex-col gap-6">
          <Timer />
        </section>

        {/* Right Column: Tasks and Sounds */}
        <section className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
          <div className="h-full min-h-[400px]">
            <TaskList />
          </div>
          <div className="h-full">
            <SoundMixer />
          </div>
        </section>

      </main>

      <footer className="max-w-6xl mx-auto mt-12 text-center text-zen-muted text-xs">
        <p>© {new Date().getFullYear()} Zen Focus Space. Stay productive.</p>
      </footer>
    </div>
  );
}
