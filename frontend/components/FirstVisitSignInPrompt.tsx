'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { AuthModal } from '@/components/auth/AuthModal';

const DISMISS_KEY = 'amai-signin-prompt-dismissed-at';
const PROMPT_DELAY_MS = 1200;
const PROMPT_COOLDOWN_MS = 7 * 24 * 60 * 60 * 1000;

function shouldHidePrompt(pathname: string) {
  return pathname !== '/' || pathname.startsWith('/signin') || pathname.startsWith('/admin');
}

export default function FirstVisitSignInPrompt() {
  const pathname = usePathname();
  const { user, loading } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (loading || user || shouldHidePrompt(pathname)) {
      setIsOpen(false);
      return;
    }

    if (typeof window === 'undefined') return;

    const dismissedAtRaw = window.localStorage.getItem(DISMISS_KEY);
    const dismissedAt = dismissedAtRaw ? Number(dismissedAtRaw) : 0;

    if (dismissedAt && Date.now() - dismissedAt < PROMPT_COOLDOWN_MS) {
      return;
    }

    const timer = window.setTimeout(() => {
      setIsOpen(true);
    }, PROMPT_DELAY_MS);

    return () => window.clearTimeout(timer);
  }, [loading, pathname, user]);

  const handleClose = () => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(DISMISS_KEY, String(Date.now()));
    }
    setIsOpen(false);
  };

  return <AuthModal isOpen={isOpen} onClose={handleClose} initialMode="login" />;
}
