'use client';

import { useEffect, useState } from 'react';
import { Workbox } from 'workbox-window';

interface PWAStatus {
  canInstall: boolean;
  isInstalled: boolean;
  isUpdateAvailable: boolean;
}

export function usePWA(): PWAStatus & {
  installPWA: () => Promise<void>;
  updatePWA: () => Promise<void>;
} {
  const [status, setStatus] = useState<PWAStatus>({
    canInstall: false,
    isInstalled: false,
    isUpdateAvailable: false,
  });

  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [wb, setWb] = useState<Workbox | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      const workbox = new Workbox('/service-worker.js');

      workbox.addEventListener('installed', (event) => {
        if (!event.isUpdate) {
          setStatus(prev => ({ ...prev, isInstalled: true }));
        }
      });

      workbox.addEventListener('waiting', () => {
        setStatus(prev => ({ ...prev, isUpdateAvailable: true }));
      });

      workbox.register();
      setWb(workbox);
    }

    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setStatus(prev => ({ ...prev, canInstall: true }));
    });

    window.addEventListener('appinstalled', () => {
      setDeferredPrompt(null);
      setStatus(prev => ({ ...prev, canInstall: false, isInstalled: true }));
    });
  }, []);

  const installPWA = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
        setStatus(prev => ({ ...prev, canInstall: false, isInstalled: true }));
      }
    }
  };

  const updatePWA = async () => {
    if (wb) {
      await wb.messageSkipWaiting();
      window.location.reload();
    }
  };

  return {
    ...status,
    installPWA,
    updatePWA,
  };
} 