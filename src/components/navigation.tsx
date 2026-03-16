
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Map, Bell, User, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

export const Navigation = () => {
  const pathname = usePathname();

  const navItems = [
    { name: 'Home', icon: Home, path: '/' },
    { name: 'Journey', icon: Map, path: '/journey' },
    { name: 'Alerts', icon: Bell, path: '/alerts' },
    { name: 'Profile', icon: User, path: '/profile' },
  ];

  return (
    <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-md px-4 z-50">
      <div className="glass-card rounded-full p-2 flex items-center justify-between">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.path}
              href={item.path}
              className={cn(
                "flex flex-col items-center gap-1 flex-1 py-2 px-1 rounded-full transition-all",
                isActive ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <item.icon className={cn("w-6 h-6", isActive && "glow-green")} />
              <span className="text-[10px] font-medium uppercase tracking-wider">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
