import { Navigation } from '@/components/navigation';
import { GlassCard } from '@/components/glass-card';
import { AlertTriangle, MapPin, Clock, Play } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

const MOCK_ALERTS = [
  {
    id: '1',
    type: 'Vehicle Accident',
    distance: '1.2km',
    time: '4m ago',
    description: 'Two-car collision near N1 Polokwane North bypass. Lanes restricted.',
    image: 'https://picsum.photos/seed/acc1/400/250',
    severity: 'MEDIUM'
  },
  {
    id: '2',
    type: 'Security Threat',
    distance: '0.4km',
    time: '12m ago',
    description: 'Suspicious individual reported near Thornhill residential area.',
    image: 'https://picsum.photos/seed/threat1/400/250',
    severity: 'HIGH'
  },
  {
    id: '3',
    type: 'Animal Hazard',
    distance: '5.6km',
    time: '22m ago',
    description: 'Livestock on roadway. Drivers advised to proceed with extreme caution.',
    image: 'https://picsum.photos/seed/haz1/400/250',
    severity: 'LOW'
  }
];

export default function AlertsPage() {
  return (
    <main className="min-h-screen pb-32 pt-12 px-6 max-w-3xl mx-auto flex flex-col gap-8">
      <header>
        <h1 className="font-headline text-3xl font-bold tracking-tight">Nearby Safety Alerts</h1>
        <p className="text-primary text-xs font-bold tracking-widest uppercase mt-1">Real-time Localised Feed</p>
      </header>

      <div className="flex gap-2">
        <GlassCard className="py-2 px-4 rounded-full border-primary/20 bg-primary/10 text-primary text-[10px] font-bold uppercase">All Incidents</GlassCard>
        <GlassCard className="py-2 px-4 rounded-full border-white/10 text-white/60 text-[10px] font-bold uppercase">Within 5km</GlassCard>
      </div>

      <div className="flex flex-col gap-6">
        {MOCK_ALERTS.map((alert) => (
          <GlassCard key={alert.id} className="p-0 overflow-hidden group">
            <div className="relative aspect-video">
              <Image 
                src={alert.image} 
                alt={alert.type} 
                fill 
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 300px"
                className="object-cover opacity-60 group-hover:opacity-80 transition-all duration-500 group-hover:scale-105"
                data-ai-hint="security footage"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-16 h-16 rounded-full glass-card flex items-center justify-center text-primary glow-green">
                  <Play className="w-8 h-8 fill-primary" />
                </div>
              </div>
              <div className="absolute top-4 left-4 flex gap-2">
                <span className={cn(
                  "px-3 py-1 rounded-full text-[10px] font-bold border backdrop-blur-md",
                  alert.severity === 'HIGH' ? "bg-destructive/20 border-destructive/40 text-destructive-foreground" : 
                  alert.severity === 'MEDIUM' ? "bg-accent/20 border-accent/40 text-accent-foreground" : "bg-primary/20 border-primary/40 text-primary"
                )}>
                  {alert.severity} SEVERITY
                </span>
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-headline font-bold text-white">{alert.type}</h3>
                <div className="flex flex-col items-end">
                   <div className="flex items-center gap-1 text-primary">
                    <MapPin className="w-3 h-3" />
                    <span className="text-[10px] font-bold">{alert.distance}</span>
                   </div>
                   <div className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    <span className="text-[10px] font-bold">{alert.time}</span>
                   </div>
                </div>
              </div>
              <p className="text-sm text-white/70 leading-relaxed mb-6">
                {alert.description}
              </p>
              <div className="flex gap-4">
                <button className="flex-1 py-3 rounded-full bg-white/10 hover:bg-white/20 text-xs font-bold uppercase tracking-widest transition-colors border border-white/10">
                  View Full Map
                </button>
                <button className="flex-1 py-3 rounded-full bg-primary/20 hover:bg-primary/30 text-primary text-xs font-bold uppercase tracking-widest transition-colors border border-primary/20">
                  Share Alert
                </button>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      <Navigation />
    </main>
  );
}
