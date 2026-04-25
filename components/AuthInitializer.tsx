'use client';

import { useEffect } from 'react';
import { initAuth } from '@/lib/firebase';

export function AuthInitializer() {
  useEffect(() => {
    initAuth();
  }, []);

  return null;
}
