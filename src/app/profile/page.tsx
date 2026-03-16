
import { Navigation } from '@/components/navigation';
import { GlassCard } from '@/components/glass-card';
import { Shield, Users, Database, Settings, LogOut, ChevronRight, Check } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';

export default function ProfilePage() {
  return (
    <main className="min-h-screen pb-32 pt-12 px-6 max-w-2xl mx-auto flex flex-col gap-8">
      <header className="flex items-center gap-6 mb-4">
        <div className="relative">
          <Avatar className="w-24 h-24 border-2 border-primary p-1">
            <AvatarImage src="https://picsum.photos/seed/user/200/200" />
            <AvatarFallback>LN</AvatarFallback>
          </Avatar>
          <div className="absolute -bottom-1 -right-1 bg-primary text-background p-1.5 rounded-full">
            <Shield className="w-4 h-4" />
          </div>
        </div>
        <div>
          <h1 className="font-headline text-3xl font-bold tracking-tight">Lebogang Nkosi</h1>
          <p className="text-primary text-xs font-bold tracking-widest uppercase">Verified Citizen • Level 4 Security</p>
        </div>
      </header>

      <div className="flex flex-col gap-6">
        <section>
          <h2 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4 ml-1">Family Protection Network</h2>
          <GlassCard className="flex flex-col gap-4">
            {[
              { name: 'Sarah Nkosi (Spouse)', status: 'Active' },
              { name: 'Junior Nkosi (Son)', status: 'Pending' }
            ].map((member) => (
              <div key={member.name} className="flex items-center justify-between group cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                    <Users className="w-6 h-6 text-white/40" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{member.name}</p>
                    <p className="text-[10px] text-primary">{member.status}</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-white/20 group-hover:text-primary transition-colors" />
              </div>
            ))}
            <button className="mt-2 w-full py-3 rounded-full border border-dashed border-white/20 hover:border-primary/50 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-all">
              + Add Family Member
            </button>
          </GlassCard>
        </section>

        <section>
          <h2 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4 ml-1">Guardian & Privacy Control (POPIA)</h2>
          <GlassCard className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-accent/10 border border-accent/20">
                  <Database className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">Dual-Camera Recording</p>
                  <p className="text-[10px] text-muted-foreground">Maintains 20s buffer for evidence</p>
                </div>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-primary/10 border border-primary/20">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">Real-time Location Share</p>
                  <p className="text-[10px] text-muted-foreground">Visible to family & responders</p>
                </div>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="pt-4 border-t border-white/5">
              <div className="flex items-center gap-2 mb-2">
                <Check className="w-4 h-4 text-primary" />
                <span className="text-[10px] font-bold uppercase text-primary">POPIA COMPLIANT</span>
              </div>
              <p className="text-[10px] text-muted-foreground leading-relaxed">
                Your data is encrypted end-to-end. Limpopo Provincial Safety does not sell your personal information. Video evidence is deleted after 48 hours unless flagged in an incident.
              </p>
            </div>
          </GlassCard>
        </section>

        <section className="flex flex-col gap-3">
          <button className="w-full glass-card p-4 rounded-2xl flex items-center justify-between hover:bg-white/10 transition-colors">
            <div className="flex items-center gap-4">
              <Settings className="w-5 h-5 text-muted-foreground" />
              <span className="text-sm font-bold uppercase tracking-wider">App Settings</span>
            </div>
            <ChevronRight className="w-5 h-5 text-white/20" />
          </button>
          
          <button className="w-full glass-card p-4 rounded-2xl flex items-center justify-between hover:bg-destructive/10 group transition-colors">
            <div className="flex items-center gap-4">
              <LogOut className="w-5 h-5 text-destructive" />
              <span className="text-sm font-bold uppercase tracking-wider text-destructive">Sign Out</span>
            </div>
            <ChevronRight className="w-5 h-5 text-destructive/20 group-hover:text-destructive" />
          </button>
        </section>
      </div>

      <Navigation />
    </main>
  );
}

import { MapPin } from 'lucide-react';
