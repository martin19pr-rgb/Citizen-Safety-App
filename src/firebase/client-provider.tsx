
'use client';

import React, { useEffect, useState, ReactNode } from 'react';
import { initializeFirebase } from './index';
import { FirebaseProvider } from './provider';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener';

export const FirebaseClientProvider = ({ children }: { children: ReactNode }) => {
  const [services, setServices] = useState<ReturnType<typeof initializeFirebase> | null>(null);

  useEffect(() => {
    const initialized = initializeFirebase();
    setServices(initialized);
  }, []);

  if (!services) {
    return null; // Or a loading spinner
  }

  return (
    <FirebaseProvider
      app={services.app}
      firestore={services.firestore}
      auth={services.auth}
      storage={services.storage}
    >
      <FirebaseErrorListener />
      {children}
    </FirebaseProvider>
  );
};
