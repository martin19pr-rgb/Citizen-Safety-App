
import { Navigation } from '@/components/navigation';
import { DualCameraPreview } from '@/components/dual-camera-preview';
import { GlassCard } from '@/components/glass-card';
import { MapPin, Navigation as NavIcon, Eye, ShieldAlert } from 'lucide-react';

export default function JourneyPage() {
  return (
    <main className="min-h-screen relative flex flex-col p-6 max-w-5xl mx-auto">
      {/* Background Simulated Map */}
      <div className="fixed inset-0 z-0 opacity-40">
        <div 
          className="w-full h-full bg-cover bg-center grayscale contrast-125"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=2066&auto=format&fit=crop)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
      </div>

      <div className="relative z-10 flex flex-col gap-6 pt-10">
        <div className="flex justify-between items-center">
          <GlassCard className="py-2 px-4 rounded-full border-primary/20 flex items-center gap-3">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse glow-green" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Journey Protection Active</span>
          </GlassCard>
          <GlassCard className="py-2 px-4 rounded-full border-accent/20 flex items-center gap-3">
            <MapPin className="w-4 h-4 text-accent" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-white">N1 • Mokopane</span>
          </GlassCard>
        </div>

        {/* Operational Interface */}
        <section className="mt-4">
          <DualCameraPreview />
        </section>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <GlassCard className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-4 mb-4">
              <NavIcon className="w-6 h-6 text-primary" />
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Destination</p>
                <p className="text-lg font-headline font-bold">Thohoyandou Centre</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-1 bg-white/5 rounded-xl p-3 border border-white/5">
                <p className="text-[10px] text-muted-foreground uppercase mb-1">Estimated Arrival</p>
                <p className="text-xl font-headline font-bold">18:45</p>
              </div>
              <div className="flex-1 bg-white/5 rounded-xl p-3 border border-white/5">
                <p className="text-[10px] text-muted-foreground uppercase mb-1">Distance Left</p>
                <p className="text-xl font-headline font-bold">142 KM</p>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="flex flex-col gap-3 justify-center items-center text-center p-8 bg-primary/10 border-primary/20">
            <Eye className="w-12 h-12 text-primary glow-green mb-2" />
            <h3 className="font-headline text-lg font-bold">EYES ON ROAD</h3>
            <p className="text-xs text-white/60">Guardian AI is monitoring surroundings for threats</p>
          </GlassCard>
        </div>

        <GlassCard className="bg-destructive/10 border-destructive/20 flex items-center gap-6 p-6">
          <div className="w-16 h-16 rounded-full bg-destructive/20 flex items-center justify-center border border-destructive/40 shrink-0">
            <ShieldAlert className="w-8 h-8 text-destructive" />
          </div>
          <div>
            <h4 className="font-headline text-xl font-bold text-white uppercase tracking-tight">Rapid Threat Protocol</h4>
            <p className="text-sm text-white/70 leading-relaxed max-w-md">
              Tap the red SOS button in the center of your screen if you suspect you are being followed.
            </p>
          </div>
          <button className="ml-auto glass-card px-6 py-3 rounded-full hover:bg-white/10 text-xs font-bold uppercase tracking-widest">
            More Info
          </button>
        </GlassCard>
      </div>

      <Navigation />
    </main>
  );
}
