'use client';

import { useEffect, useState } from 'react';
import { usePWA } from '../../hooks/usePWA';
import { Button } from '../Button';
import { Dialog } from '@radix-ui/react-dialog';

function PWAPrompt() {
  const { canInstall, isUpdateAvailable, installPWA, updatePWA } = usePWA();
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Show prompt after 30 seconds if can install
    if (canInstall) {
      const timer = setTimeout(() => setShowPrompt(true), 30000);
      return () => clearTimeout(timer);
    }
  }, [canInstall]);

  if (!canInstall && !isUpdateAvailable) return null;

  return (
    <Dialog.Root open={showPrompt || isUpdateAvailable} onOpenChange={setShowPrompt}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg">
          <Dialog.Title className="text-lg font-semibold mb-4">
            {isUpdateAvailable ? 'Update Available' : 'Install App'}
          </Dialog.Title>
          <Dialog.Description className="mb-6">
            {isUpdateAvailable
              ? 'A new version of the app is available. Would you like to update now?'
              : 'Install Drink Index for a better experience with offline access and quick loading.'}
          </Dialog.Description>
          <div className="flex justify-end gap-4">
            <Button variant="ghost" onClick={() => setShowPrompt(false)}>
              Not Now
            </Button>
            <Button onClick={isUpdateAvailable ? updatePWA : installPWA}>
              {isUpdateAvailable ? 'Update' : 'Install'}
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export { PWAPrompt }; 