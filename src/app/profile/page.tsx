
"use client";

import React, { useState, useEffect } from 'react';
import { Navigation } from '@/components/navigation';
import { GlassCard } from '@/components/glass-card';
import { Shield, Users, Database, MapPin, Edit2, Save, Camera, ChevronRight, Check, Phone } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useUser, useFirestore, useDoc } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export default function ProfilePage() {
  const { user } = useUser();
  const db = useFirestore();
  const { data: remoteProfile, loading } = useDoc(user ? doc(db, 'users', user.uid) : null);
  
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: 'Lebogang Nkosi',
    bloodType: 'O+',
    allergies: 'Penicillin, Peanuts',
    vehiclePlate: 'LP 44 NN GP',
    spouseName: 'Annah',
    secondaryContactName: 'Thabo Nkosi',
    secondaryContactPhone: '082 555 1234',
    photoUrl: 'https://picsum.photos/seed/user/200/200'
  });

  useEffect(() => {
    if (remoteProfile) {
      setProfile({
        name: remoteProfile.name || 'Lebogang Nkosi',
        bloodType: remoteProfile.bloodType || 'O+',
        allergies: remoteProfile.allergies || 'Penicillin, Peanuts',
        vehiclePlate: remoteProfile.vehiclePlate || 'LP 44 NN GP',
        spouseName: remoteProfile.spouseName || 'Annah',
        secondaryContactName: remoteProfile.secondaryContactName || 'Thabo Nkosi',
        secondaryContactPhone: remoteProfile.secondaryContactPhone || '082 555 1234',
        photoUrl: remoteProfile.photoUrl || 'https://picsum.photos/seed/user/200/200'
      });
    }
  }, [remoteProfile]);

  const handleSave = () => {
    if (!user || !db) return;
    
    const userRef = doc(db, 'users', user.uid);
    setDoc(userRef, profile, { merge: true })
      .then(() => setIsEditing(false))
      .catch(async (err) => {
        const permissionError = new FirestorePermissionError({
          path: userRef.path,
          operation: 'update',
          requestResourceData: profile,
        });
        errorEmitter.emit('permission-error', permissionError);
      });
  };

  const handlePhotoUpload = () => {
    const seeds = ['user1', 'user2', 'user3', 'user4'];
    const randomSeed = seeds[Math.floor(Math.random() * seeds.length)];
    setProfile(prev => ({ ...prev, photoUrl: `https://picsum.photos/seed/${randomSeed}/200/200` }));
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="font-headline text-primary uppercase tracking-widest text-xs font-bold">Initializing Guardian Profile</p>
      </div>
    </div>
  );

  return (
    <main className="min-h-screen pb-32 pt-12 px-6 max-w-2xl mx-auto flex flex-col gap-8">
      <header className="flex items-center gap-6 mb-4">
        <div className="relative group cursor-pointer" onClick={handlePhotoUpload}>
          <Avatar className="w-24 h-24 border-2 border-primary p-1 transition-transform group-hover:scale-105">
            <AvatarImage src={profile.photoUrl} />
            <AvatarFallback>LN</AvatarFallback>
          </Avatar>
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 rounded-full transition-opacity">
            <Camera className="w-6 h-6 text-white" />
          </div>
          <div className="absolute -bottom-1 -right-1 bg-primary text-background p-1.5 rounded-full">
            <Shield className="w-4 h-4" />
          </div>
        </div>
        <div className="flex-1">
          {isEditing ? (
            <Input 
              value={profile.name} 
              onChange={(e) => setProfile({...profile, name: e.target.value})}
              className="font-headline text-2xl font-bold bg-white/5 border-primary/20 h-10 mb-2"
            />
          ) : (
            <h1 className="font-headline text-3xl font-bold tracking-tight">{profile.name}</h1>
          )}
          <p className="text-primary text-xs font-bold tracking-widest uppercase">Verified Citizen • Level 4 Security</p>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          className="rounded-full hover:bg-white/10"
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
        >
          {isEditing ? <Save className="w-5 h-5 text-primary" /> : <Edit2 className="w-5 h-5 text-white/60" />}
        </Button>
      </header>

      <div className="flex flex-col gap-6">
        <section>
          <h2 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4 ml-1">Medical & Vehicle Details</h2>
          <GlassCard className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-[10px] text-muted-foreground uppercase">Blood Type</Label>
              {isEditing ? (
                <Input value={profile.bloodType} onChange={(e) => setProfile({...profile, bloodType: e.target.value})} className="bg-white/5 border-white/10" />
              ) : (
                <p className="text-sm font-bold text-white">{profile.bloodType}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] text-muted-foreground uppercase">Allergies</Label>
              {isEditing ? (
                <Input value={profile.allergies} onChange={(e) => setProfile({...profile, allergies: e.target.value})} className="bg-white/5 border-white/10" />
              ) : (
                <p className="text-sm font-bold text-white">{profile.allergies}</p>
              )}
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label className="text-[10px] text-muted-foreground uppercase">Vehicle Registration</Label>
              {isEditing ? (
                <Input value={profile.vehiclePlate} onChange={(e) => setProfile({...profile, vehiclePlate: e.target.value})} className="bg-white/5 border-white/10" />
              ) : (
                <p className="text-sm font-bold text-white">{profile.vehiclePlate}</p>
              )}
            </div>
          </GlassCard>
        </section>

        <section>
          <h2 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4 ml-1">Guardian Network</h2>
          <GlassCard className="flex flex-col gap-4">
            <div className="flex items-center justify-between group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <div>
                   <Label className="text-[8px] uppercase text-muted-foreground">Primary Guardian (Spouse)</Label>
                  {isEditing ? (
                    <Input value={profile.spouseName} onChange={(e) => setProfile({...profile, spouseName: e.target.value})} className="bg-white/5 h-8 text-xs" />
                  ) : (
                    <p className="text-sm font-bold text-white">{profile.spouseName}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                  <Phone className="w-6 h-6 text-white/40" />
                </div>
                <div className="flex-1 grid grid-cols-1 gap-2">
                  <Label className="text-[8px] uppercase text-muted-foreground">Secondary Contact</Label>
                  {isEditing ? (
                    <div className="flex gap-2">
                      <Input value={profile.secondaryContactName} onChange={(e) => setProfile({...profile, secondaryContactName: e.target.value})} className="bg-white/5 h-8 text-xs" placeholder="Name" />
                      <Input value={profile.secondaryContactPhone} onChange={(e) => setProfile({...profile, secondaryContactPhone: e.target.value})} className="bg-white/5 h-8 text-xs" placeholder="Phone" />
                    </div>
                  ) : (
                    <div className="flex justify-between items-center">
                      <p className="text-sm font-bold text-white">{profile.secondaryContactName}</p>
                      <p className="text-xs text-muted-foreground">{profile.secondaryContactPhone}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </GlassCard>
        </section>

        <section>
          <h2 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4 ml-1">Privacy & Evidence</h2>
          <GlassCard className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-accent/10 border border-accent/20">
                  <Database className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">Dual-Camera Recording</p>
                  <p className="text-[10px] text-muted-foreground">Always-on logging during journeys</p>
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
                  <p className="text-sm font-bold text-white">Location Sharing</p>
                  <p className="text-[10px] text-muted-foreground">Shared with Annah & Thabo</p>
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
                Your evidence is encrypted. Only you or authorized command officers can unlock footage for incident review.
              </p>
            </div>
          </GlassCard>
        </section>
      </div>

      <Navigation />
    </main>
  );
}
